-- Create a new table with the desired structure including timestamp columns
CREATE TABLE `words_new` (
    `value` text NOT NULL,
    `username` text NOT NULL,
    `isDeleted` integer DEFAULT 0 NOT NULL,
    `updatedAt` text DEFAULT (datetime('now')) NOT NULL,
    `createdAt` text DEFAULT (datetime('now')) NOT NULL,
    PRIMARY KEY(`value`, `username`),
    FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint

-- Copy existing data from old table to new table, setting timestamps to current time
INSERT INTO `words_new` (`value`, `username`, `isDeleted`, `updatedAt`, `createdAt`)
SELECT 
    `value`, 
    `username`, 
    `isDeleted`, 
    datetime('now'),
    datetime('now')
FROM `words`;--> statement-breakpoint

-- Drop the old table
DROP TABLE `words`;--> statement-breakpoint

-- Rename the new table to the original name
ALTER TABLE `words_new` RENAME TO `words`;