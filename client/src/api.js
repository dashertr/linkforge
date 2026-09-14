const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || "The request failed. Please try again.");
  }

  return payload;
}

export function createShortLink(url) {
  return request("/api/links", {
    method: "POST",
    body: JSON.stringify({ url })
  });
}

export function getRecentLinks() {
  return request("/api/links");
}

export { API_BASE_URL };
