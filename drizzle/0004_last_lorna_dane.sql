CREATE TABLE `words` (
	`value` text PRIMARY KEY NOT NULL,
	`username` text,
	`isDeleted` integer DEFAULT 0,
	FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `codeword` text NOT NULL;