const decodeXmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

export const getTagValue = (xml: string, tag: string): string | null => {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match?.[1]) return null;

  return decodeXmlEntities(match[1]);
};

export const getLineItemsXml = (xml: string): string[] => {
  return xml.match(/<LineItem>[\s\S]*?<\/LineItem>/g) ?? [];
};

export const parseTTNDate = (rawDate: string | null): Date | null => {
  if (!rawDate) return null;

  const parsedDate = new Date(rawDate);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const parseTTNNumber = (xml: string): string | null => {
  const series = getTagValue(xml, 'TTNSeries');
  const number = getTagValue(xml, 'TTNNumber');

  if (!series && !number) return null;

  return `${series ?? ''}${number ?? ''}`;
};

export const getProductRowData = (lineItemXml: string) => {
  const name = getTagValue(lineItemXml, 'Name');
  const manufacturer = getTagValue(lineItemXml, 'ManufactureCode');

  return {
    sku: getTagValue(lineItemXml, 'Code'),
    name: manufacturer ? `${name ?? ''} ${manufacturer}` : name,
    units: getTagValue(lineItemXml, 'QuantityUOM'),
    quantity: getTagValue(lineItemXml, 'QuantityDespatched'),
    sumWithVat: getTagValue(lineItemXml, 'Amount'),
    description: '',
  };
};
