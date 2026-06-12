function log(level, message, meta = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, message, ...meta });
  if (level === "error") process.stderr.write(line + "\n");
  else process.stdout.write(line + "\n");
}
export const logger = {
  info: (m, meta) => log("info", m, meta),
  warn: (m, meta) => log("warn", m, meta),
  error: (m, meta) => log("error", m, meta),
};
