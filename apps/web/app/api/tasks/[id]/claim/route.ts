import { NextResponse } from 'next/server';
import { adminDb, FieldValue } from '@/lib/firebase-admin';
import { verifyFirebaseToken, requireAuth } from '@/lib/verify-auth';

const MAX_ACTIVE_TASKS = 5;

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  // Auth guard — requires a valid Firebase ID token
  const decoded = await verifyFirebaseToken(req);
  const deny = requireAuth(decoded);
  if (deny) return deny;

  try {
    const { id: taskId } = await context.params;
    const body = await req.json();
    const { volunteerId } = body;

    if (!volunteerId || typeof volunteerId !== 'string') {
      return NextResponse.json({ error: 'volunteerId required' }, { status: 400 });
    }

    // Enforce: requesting user can only claim as themselves
    if (decoded!.uid !== volunteerId) {
      return NextResponse.json({ error: 'Cannot claim task on behalf of another volunteer' }, { status: 403 });
    }

    const taskRef = adminDb.collection('tasks').doc(taskId);
    const volRef  = adminDb.collection('volunteers').doc(volunteerId);

    // Transaction: prevent double-claims and enforce active-task cap
    await adminDb.runTransaction(async (txn) => {
      const [taskSnap, volSnap] = await Promise.all([txn.get(taskRef), txn.get(volRef)]);

      if (!taskSnap.exists) {
        throw Object.assign(new Error('Task not found'), { code: 404 });
      }

      const task = taskSnap.data()!;
      if (task.status !== 'OPEN') {
        throw Object.assign(new Error(`Task is not claimable (current status: ${task.status})`), { code: 409 });
      }

      const volData = volSnap.data() ?? {};
      const activeTasks = typeof volData.currentActiveTasks === 'number' ? volData.currentActiveTasks : 0;
      if (activeTasks >= MAX_ACTIVE_TASKS) {
        throw Object.assign(new Error(`Active task limit reached (max ${MAX_ACTIVE_TASKS})`), { code: 429 });
      }

      txn.update(taskRef, { status: 'CLAIMED', claimedBy: volunteerId, claimedAt: new Date() });

      if (volSnap.exists) {
        txn.update(volRef, { currentActiveTasks: FieldValue.increment(1) });
      } else {
        txn.set(volRef, { currentActiveTasks: 1 }, { merge: true });
      }
    });

    return NextResponse.json({ success: true, status: 'CLAIMED' });

  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    const status = err.code ?? 500;
    const msg = status < 500
      ? (err.message ?? 'Request error')
      : process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : (err.message ?? String(error));
    return NextResponse.json({ error: msg }, { status });
  }
}
