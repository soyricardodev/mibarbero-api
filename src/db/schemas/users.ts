import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		id: integer("id").primaryKey().notNull(),
		name: text("name").notNull(),
		username: text("username").unique().notNull(),
		picture: text("picture"),
		hashedPassword: text("hashed_password").notNull(),
		role: text("role").notNull().default("user"),
		verified: integer("verified").notNull().default(0),
		createdAt: integer("created_at").notNull(),
		updatedAt: integer("updated_at"),
	},
	(users) => ({
		idIdx: index("user_id_idx").on(users.id),
	}),
);

export const tokens = sqliteTable(
	"tokens",
	{
		id: integer("id").primaryKey().notNull(),
		ownerId: integer("owner_id").notNull(),
		accessToken: text("access_token").notNull(),
		refreshToken: text("refresh_token").notNull(),
		createdAt: integer("created_at"),
	},
	(tokens) => ({
		idIdx: index("tokens_id_idx").on(tokens.id),
	}),
);
