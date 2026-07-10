/** Read a single cookie value from a raw `Cookie` header string. */
export function readCookie(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }
  const entry = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

/** Write a persistent cookie (browser only — caller must guard the platform). */
export function writeCookie(doc: Document, name: string, value: string, maxAgeDays = 365): void {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  doc.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}
