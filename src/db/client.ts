import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users, tokens } from "./schemas";
import { env } from "../env";

const turso = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso, {
	schema: {
		...users,
		...tokens,
	},
});
