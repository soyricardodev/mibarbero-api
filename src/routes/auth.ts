import { t } from "elysia";
import { eq } from "drizzle-orm";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { createElysia } from "../utils/elysia";
import { db } from "../db/client";
import { tokens, users } from "../db/schemas";
import { env } from "../env";

export const authRoute = createElysia()
	.post(
		"/sign-in",
		async ({ body }) => {
			const { username, password } = body;

			const user = await db
				.select({
					id: users.id,
					hashedPassword: users.hashedPassword,
				})
				.from(users)
				.where(eq(users.username, username))
				.limit(1);

			console.log({ user });

			if (!user.length) {
				return { error: "User not found" };
			}

			const userHashedPassword = user[0].hashedPassword;

			const matchPassword = await verify(userHashedPassword, password);

			if (!matchPassword) {
				return { error: "Invalid password" };
			}

			const jwtSecret = env.JWT_SECRET;
			const expiresInToken = "1d";

			const accessToken = jwt.sign({ id: user[0].id }, jwtSecret, {
				expiresIn: expiresInToken,
			});

			const refreshToken = jwt.sign(
				{ id: user[0].id, date: new Date().getTime() },
				jwtSecret,
				{
					expiresIn: expiresInToken,
				},
			);

			await db.insert(tokens).values({
				accessToken,
				refreshToken,
				ownerId: user[0].id,
			});

			return { accessToken, refreshToken };
		},
		{
			body: t.Object({
				username: t.String(),
				password: t.String(),
			}),
		},
	)
	.post(
		"/sign-up",
		async ({ body }) => {
			const { username, password, name, picture } = body;

			console.log({ username, password, name, picture });

			const user = await db
				.select()
				.from(users)
				.where(eq(users.username, username))
				.limit(1);

			console.log({ user });

			if (user.length) {
				return { error: "User already exists" };
			}

			const hashedPassword = await hash(password);
			console.log({ hashedPassword });

			const timestampNow = new Date().getTime();

			const createdUser = await db
				.insert(users)
				.values({
					username,
					hashedPassword,
					name,
					picture,
					createdAt: timestampNow,
					updatedAt: timestampNow,
				})
				.returning();
			console.log({ createdUser });

			if (!createdUser) {
				return { error: "Error creating user" };
			}

			const jwtSecret = env.JWT_SECRET;
			const expiresInToken = "1d";

			const accessToken = jwt.sign({ id: createdUser[0].id }, jwtSecret, {
				expiresIn: expiresInToken,
			});

			const refreshToken = jwt.sign(
				{ id: createdUser[0].id, date: new Date().getTime() },
				jwtSecret,
				{
					expiresIn: expiresInToken,
				},
			);

			console.log({ accessToken, refreshToken });

			const tokensInserted = await db.insert(tokens).values({
				accessToken,
				refreshToken,
				ownerId: createdUser[0].id,
			});

			console.log({ tokensInserted });

			return { accessToken, refreshToken, createdUser };
		},
		{
			body: t.Object({
				username: t.String(),
				password: t.String(),
				picture: t.String(),
				name: t.String(),
			}),
		},
	)
	.post(
		"/sign-out/:userId",
		async (req) => {
			const { userId } = req.params;

			const user = await db
				.select({
					id: users.id,
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken,
				})
				.from(users)
				.leftJoin(tokens, eq(tokens.ownerId, users.id))
				.limit(1);

			if (!user.length || user == null) {
				return { error: "Invalid refresh token" };
			}

			// TODO: implment refresh token logic

			return { success: true };
		},
		{
			params: t.Object({
				userId: t.String(),
			}),
		},
	)
	.get("/users", async () => {
		const usersData = await db
			.select({
				id: users.id,
				username: users.username,
				name: users.name,
				picture: users.picture,
			})
			.from(users)
			.where(eq(users.role, "user"))
			.limit(10);

		return usersData;
	});
