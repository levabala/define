PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_words` (
	`value` text,
	`username` text NOT NULL,
	`isDeleted` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`value`, `username`),
	FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_words`("value", "username", "isDeleted") SELECT "value", "username", "isDeleted" FROM `words`;--> statement-breakpoint
DROP TABLE `words`;--> statement-breakpoint
ALTER TABLE `__new_words` RENAME TO `words`;--> statement-breakpoint
PRAGMA foreign_keys=ON;