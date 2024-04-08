import { users } from "./users";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const barberTable = sqliteTable("barber", {
	id: text("id").notNull().primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	description: text("description"),
});
