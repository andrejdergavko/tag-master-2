import { WorkSheet, utils } from 'xlsx';

export const getRowsInJSON = (
  sheet: WorkSheet,
): (string | number | null)[][] => {
  return utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });
};
