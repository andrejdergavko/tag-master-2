export const MIME_TYPE_PDF = 'application/pdf';
export const MIME_TYPE_EXCEL =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const MIME_TYPE_EXCEL_OLD = 'application/vnd.ms-excel';
export const MIME_TYPE_EXCEL_MSEXCEL = 'application/msexcel';

export const EXTENSION_MIME_TYPE_MAPPER = {
  '.pdf': MIME_TYPE_PDF,
  '.xlsx': MIME_TYPE_EXCEL,
  '.xls': MIME_TYPE_EXCEL_OLD,
};
