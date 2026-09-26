import type { AdminUser } from "./api";

export type AuthState = { token: string; admin: AdminUser } | null;

const KEY = "cmm-auth";

function load(): AuthState {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    return null;
  }
}

// Rehydrated from localStorage on load so the admin session survives a page refresh.
let _auth: AuthState = load();

export const authStore = {
  get: () => _auth,
  set: (state: AuthState) => {
    _auth = state;
    if (typeof localStorage === "undefined") return;
    if (state) localStorage.setItem(KEY, JSON.stringify(state));
    else localStorage.removeItem(KEY);
  },
  clear: () => {
    _auth = null;
    if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
  },
  getToken: () => _auth?.token ?? "",
  isAuthed: () => !!_auth?.token,
};
