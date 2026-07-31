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
    product.name !== 'ИТОГО'
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
    units: row[10],
    quantity: row[12],
    price: row[15],
    cost: row[18],
    vatPersent: row[21],
    vat: row[23],
    sumWithVat: row[26],
    description: row[29],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[12],
    totalCost: row[18],
    totalVat: row[23],
    totalSumWithVat: row[26],
  };
};
