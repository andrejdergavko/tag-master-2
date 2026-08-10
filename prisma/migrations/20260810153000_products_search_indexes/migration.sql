-- CreateIndex
CREATE INDEX "Document_supplierId_idx" ON "Document"("supplierId");

-- CreateIndex
CREATE INDEX "Document_date_idx" ON "Document"("date");

-- CreateIndex
CREATE INDEX "DocumentItem_name_idx" ON "DocumentItem"("name");

-- CreateIndex
CREATE INDEX "DocumentItem_sku_idx" ON "DocumentItem"("sku");

-- CreateIndex
CREATE INDEX "DocumentItem_documentId_idx" ON "DocumentItem"("documentId");
