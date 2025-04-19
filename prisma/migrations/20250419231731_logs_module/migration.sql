-- AlterTable
ALTER TABLE "Guild" ALTER COLUMN "modules" SET DEFAULT '{"administration": { "editable": false, "enabled": true }, "general": { "editable": false, "enabled": true }, "images": { "editable": true, "enabled": true }, "miscellaneous": { "editable": true, "enabled": true }, "logs": { "editable": true, "enabled": false } }';
