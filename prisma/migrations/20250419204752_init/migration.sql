-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "modules" JSONB NOT NULL DEFAULT '{"administration": { "editable": false, "enabled": true }, "general": { "editable": false, "enabled": true }, "images": { "editable": true, "enabled": true }, "miscellaneous": { "editable": true, "enabled": true } }',
    "language" TEXT NOT NULL DEFAULT 'en-US',

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");
