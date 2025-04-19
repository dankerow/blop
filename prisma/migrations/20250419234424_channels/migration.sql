-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "channels" JSONB NOT NULL DEFAULT '{ "logs": {"events": null, "moderation": null } }';
