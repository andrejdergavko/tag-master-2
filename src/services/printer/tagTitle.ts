// Формат как у ценника из документа: 12-2X9-647
// {цена}X{месяц}-{последняя цифра года}{случайные две цифры}
export const buildDocumentTagTitle = (
  name: string,
  price: number,
  sku?: string,
  options?: { date?: Date; randomSuffix?: string },
): string => {
  const date = options?.date ?? new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 10;
  const formattedPrice = price.toFixed(1).replace('.', '-');
  const randomSuffix =
    options?.randomSuffix ??
    String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const specialCode = `${formattedPrice}X${month}-${year}${randomSuffix}`;

  return sku ? `${sku} ${name}, ${specialCode}` : `${name}, ${specialCode}`;
};
