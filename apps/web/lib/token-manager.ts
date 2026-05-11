const KEY = "ngo_token";
const MAX_AGE = 60 * 60 * 24; // 24 hours

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, token);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${KEY}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Strict${secure}`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  document.cookie = `${KEY}=; path=/; max-age=0; SameSite=Strict`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}
