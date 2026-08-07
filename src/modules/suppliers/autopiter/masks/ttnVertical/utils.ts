export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (
    typeof product.quantity === 'number' &&
    product.name !== null &&
    product.quantity !== null &&
    product.price !== null &&
    product.cost !== null &&
    product.sumWithVat !== null &&
    product.name !== 1 &&
    product.name !== 'ИТОГО' &&
    product.name !== 'ИТОГО ПО СТРАНИЦЕ'
  ) {
    return 'product';
  }

  if (product.name === 'ИТОГО') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    name: row[1],
    units: row[7],
    quantity: row[9],
    price: row[12],
    cost: row[15],
    vatPersent: row[18],
    vat: row[20],
    sumWithVat: row[23],
    description: row[32],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[9],
    totalCost: row[15],
    totalVat: row[20],
    totalSumWithVat: row[23],
  };
};

export const parseTTNNumber = (
  rawCell: unknown,
): { number: string } | null => {
  if (typeof rawCell !== 'string') return null;

  const numberMatch = rawCell.match(/\d{6,}/);
  if (!numberMatch) return null;

  return {
    number: numberMatch[0],
  };
};
