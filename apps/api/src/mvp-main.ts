import { createApp } from "./app.js";
import { readConfig } from "./config.js";
import { createDatabase } from "./infrastructure/prisma/database.js";
import { installMvpGraphql } from "./adapters/mvp-graphql.js";
if (process.env.MVP_SYNTHETIC_ONLY !== "true" || !process.env.DATABASE_URL)
  throw new Error(
    "Set MVP_SYNTHETIC_ONLY=true and DATABASE_URL for the local development MVP.",
  );
const config = readConfig(process.env);
if (!["127.0.0.1", "localhost", "::1"].includes(config.HOST))
  throw new Error("MVP is restricted to loopback interfaces.");
const database = createDatabase(process.env.DATABASE_URL);
const app = createApp();
installMvpGraphql(app, database);
const server = app.listen(config.PORT, config.HOST, () =>
  console.info(
    `Local synthetic MVP API on http://${config.HOST}:${config.PORT}`,
  ),
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.once(signal, () =>
    server.close(() => {
      void database.$disconnect().finally(() => process.exit(0));
    }),
  );
