import { Elysia } from "elysia";
import { authRoute } from "./routes/auth";

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.use(authRoute)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
