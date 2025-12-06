/*
  Warnings:

  - You are about to drop the column `prompt` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE IF EXISTS "generated_resumes" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "prompt",
DROP COLUMN "sections";
