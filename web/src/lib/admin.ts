const DEFAULT_ADMINS = ["ecomercelojavirtual366@gmail.com"];

export function getAdminEmails() {
  const fromEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (!fromEnv) return DEFAULT_ADMINS;
  return fromEnv
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
 
