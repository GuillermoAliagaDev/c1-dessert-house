import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "node:crypto";

const COOKIE = "admin_session";
const isProd = process.env.NODE_ENV === "production";

// En producción las variables son obligatorias: sin ellas no hay valores por defecto inseguros.
function env(name: string, devFallback: string) {
  const v = process.env[name];
  if (v) return v;
  if (isProd) throw new Error(`Falta la variable de entorno ${name}`);
  return devFallback;
}

const secret = () => new TextEncoder().encode(env("AUTH_SECRET", "dev-secret-change-me-please-32chars!"));

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function checkCredentials(user: string, pass: string) {
  const u = env("ADMIN_USER", "admin");
  const p = env("ADMIN_PASSWORD", "postres123");
  return safeEqual(user, u) && safeEqual(pass, p);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
