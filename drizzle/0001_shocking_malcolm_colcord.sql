CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`owner` text NOT NULL,
	`payload` text NOT NULL,
	`version` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_code_unique` ON `events` (`code`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`event` text NOT NULL,
	`owner` text NOT NULL,
	`mime` text NOT NULL
);
