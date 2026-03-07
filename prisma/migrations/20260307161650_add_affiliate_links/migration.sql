-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "retailer" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
