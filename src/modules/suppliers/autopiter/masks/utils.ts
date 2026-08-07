import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';
import { WorkSheet, utils } from 'xlsx';

export const parseInvoiceDate = (rawDate: unknown): Date | null => {
  if (typeof rawDate !== 'string') return null;

  const normalizedDate = rawDate.replace(/\s*г\.$/, '').trim();
  const parsedDate = parse(normalizedDate, 'd MMMM yyyy', new Date(), {
    locale: ru,
  });

  return isValid(parsedDate) ? parsedDate : null;
};
