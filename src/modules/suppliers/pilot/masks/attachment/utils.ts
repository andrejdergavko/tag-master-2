export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name !== '' &&
    product.sku !== null &&
    product.sku !== '' &&
    product.units !== null &&
    product.sumWithVat !== null
  ) {
    return 'product';
  }

  if (product.name === null && typeof product.sumWithVat === 'number') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[1],
    barcode: row[2],
    name: row[3],
    units: row[4],
    quantity: row[5],
    price: row[8],
    sumWithVat: row[12],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[12],
  };
};

export const parseDocumentNumberFromAttachmentName = (
  attachmentName: unknown,
): string | null => {
  if (typeof attachmentName !== 'string') return null;

  const match = attachmentName.match(/(\d+)\.xls$/i);
  if (!match) return null;

  return String(Number(match[1]));
};
