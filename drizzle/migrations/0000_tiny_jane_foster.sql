CREATE TABLE `barber` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`description` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` integer PRIMARY KEY NOT NULL,
	`owner_id` integer NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`picture` text NOT NULL,
	`hashed_password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`verified` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `tokens_id_idx` ON `tokens` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `users` (`id`);