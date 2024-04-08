import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const url = process.env.TURSO_DATABASE_URL as string;
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
	driver: "turso",
	schema: "./src/db/schemas",
	dbCredentials: {
		url,
		authToken,
	},
	out: "./drizzle/migrations",
	verbose: true,
});
