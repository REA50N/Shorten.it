/*
  Warnings:

  - You are about to drop the column `slug` on the `Link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slugUrl]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Link_shortUrl_idx";

-- DropIndex
DROP INDEX "Link_slug_idx";

-- DropIndex
DROP INDEX "Link_slug_key";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "slug",
ADD COLUMN     "slugUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Link_slugUrl_key" ON "Link"("slugUrl");
