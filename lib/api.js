const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ตัวช่วยเรียก API กลาง — จับ error แล้วโยนข้อความไทยจาก backend ออกมา
export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* ไม่มี body ก็ใช้ status */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const API_BASE = BASE;
