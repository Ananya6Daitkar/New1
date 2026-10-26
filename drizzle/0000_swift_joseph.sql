CREATE TABLE `previews` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`task` text,
	`status` text NOT NULL,
	`created` integer NOT NULL
);
