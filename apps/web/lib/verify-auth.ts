import * as admin from "firebase-admin";
import "@/lib/firebase-admin"; // ensure Admin SDK is initialised

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns the decoded token or null if missing/invalid.
 */
export async function verifyFirebaseToken(
  req: Request,
): Promise<admin.auth.DecodedIdToken | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    return null;
  }
}

/**
 * Returns a 401 JSON response if decoded is null; otherwise returns null.
 * Usage: const deny = requireAuth(decoded); if (deny) return deny;
 */
export function requireAuth(
  decoded: admin.auth.DecodedIdToken | null,
): Response | null {
  if (!decoded) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }
  return null;
}
