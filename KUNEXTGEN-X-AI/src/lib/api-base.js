const explicitBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");

function inferLocalApiBase() {
  if (typeof window === "undefined") return "";
  const { hostname, port, protocol } = window.location;

  if (explicitBase) return explicitBase;
  if (port === "5173" || port === "4173") {
    return `${protocol}//${hostname}:3001`;
  }
  return "";
}

export const API_BASE = inferLocalApiBase();

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
