import { NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { verifyFirebaseToken, requireAuth } from '@/lib/verify-auth';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  // Auth guard — requires a valid Firebase ID token
  const decoded = await verifyFirebaseToken(req);
  const deny = requireAuth(decoded);
  if (deny) return deny;

  try {
    const { id: taskId } = await context.params;
    const formData    = await req.formData();
    const file        = formData.get('file') as File | null;
    const volunteerId = formData.get('volunteerId') as string | null;

    if (!file || !volunteerId) {
      return NextResponse.json({ error: 'file and volunteerId are required' }, { status: 400 });
    }

    // Enforce: user can only submit as themselves
    if (decoded!.uid !== volunteerId) {
      return NextResponse.json({ error: 'Cannot submit on behalf of another volunteer' }, { status: 403 });
    }

    // Validate file size
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File too large — maximum ${MAX_FILE_BYTES / 1024 / 1024} MB` },
        { status: 413 },
      );
    }

    // Validate MIME type
    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported file type "${mimeType}". Allowed: jpeg, png, webp, gif` },
        { status: 415 },
      );
    }

    // Verify task exists, is claimed by this volunteer, and is in CLAIMED state
    const taskRef  = adminDb.collection('tasks').doc(taskId);
    const taskSnap = await taskRef.get();
    if (!taskSnap.exists) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    const task = taskSnap.data()!;
    if (task.claimedBy !== volunteerId) {
      return NextResponse.json({ error: 'Task not claimed by this volunteer' }, { status: 403 });
    }
    if (task.status !== 'CLAIMED') {
      return NextResponse.json({ error: `Task cannot be submitted (status: ${task.status})` }, { status: 409 });
    }

    // Upload to Firebase Storage
    const bucket      = adminStorage.bucket();
    const ext         = mimeType.split('/')[1] ?? 'jpg';
    const storagePath = `verifications/${taskId}_${Date.now()}.${ext}`;
    const bucketFile  = bucket.file(storagePath);

    const buffer = Buffer.from(await file.arrayBuffer());
    await bucketFile.save(buffer, { metadata: { contentType: mimeType } });
    await bucketFile.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    // Mark VERIFICATION_PENDING
    await taskRef.update({ status: 'VERIFICATION_PENDING', verificationImageUrl: publicUrl });

    // Build verify URL from environment — never trust Host header in security-sensitive flows
    const appUrl =
      process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : null);

    if (!appUrl) {
      // Cannot construct verify URL — leave VERIFICATION_PENDING for manual review
      return NextResponse.json({ success: true, url: publicUrl, status: 'VERIFICATION_PENDING' });
    }

    const verifyUrl     = `${appUrl}/api/verify`;
    const serviceSecret = process.env.INTERNAL_SERVICE_SECRET ?? '';
    let   finalStatus   = 'VERIFICATION_PENDING';

    try {
      const verifyRes = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(serviceSecret ? { 'x-service-secret': serviceSecret } : {}),
        },
        body: JSON.stringify({ taskId }),
      });
      if (verifyRes.ok) {
        const data = await verifyRes.json();
        finalStatus = data.status ?? 'VERIFICATION_PENDING';
      }
    } catch {
      // Verification failed — task remains VERIFICATION_PENDING for manual review
    }

    return NextResponse.json({ success: true, url: publicUrl, status: finalStatus });

  } catch (error: unknown) {
    const msg = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
