/**
 * Backend base URL.
 * Dev: empty string → relative URLs through the Vite proxy (same-origin cookies).
 * Prod: VITE_BASE_URL from the environment.
 */
export function getBackendBaseUrl() {
  if (import.meta.env.DEV) {
    return "";
  }
  const configured = import.meta.env.VITE_BASE_URL?.trim();
  return (configured || "http://127.0.0.1:8000").replace(/\/$/, "");
}

export const BACKEND_BASE_URL = getBackendBaseUrl();
