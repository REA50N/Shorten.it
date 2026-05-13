-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortUrl" VARCHAR(10) NOT NULL,
    "slug" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortUrl_key" ON "Link"("shortUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_slug_idx" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_shortUrl_idx" ON "Link"("shortUrl");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
