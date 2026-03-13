import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

type AppDatabase = PostgresJsDatabase<typeof schema>;

declare global {
  var __romegaPostgresClient: ReturnType<typeof postgres> | undefined;
  var __romegaDb: AppDatabase | undefined;
}

const postgresClient =
  globalThis.__romegaPostgresClient ??
  postgres(connectionString, {
    // Recommended when using Supabase pooler / pgbouncer.
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__romegaPostgresClient = postgresClient;
}

export const db: AppDatabase =
  globalThis.__romegaDb ??
  drizzle(postgresClient, {
    schema,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__romegaDb = db;
}

export { schema };
