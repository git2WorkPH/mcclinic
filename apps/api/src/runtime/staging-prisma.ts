// Prisma's native migration engine has different TLS URL options from node-postgres.
// Only call with the separately validated staging host and migration-role secret.
export function stagingPrismaUrl(
  host: string,
  username: string,
  password: string,
  caPath: string,
) {
  const url = new URL(`postgresql://${host}:5432/mcclinic`);
  url.username = username;
  url.password = password;
  url.searchParams.set('sslmode', 'require');
  url.searchParams.set('sslaccept', 'strict');
  url.searchParams.set('sslcert', caPath);
  return url.href;
}
