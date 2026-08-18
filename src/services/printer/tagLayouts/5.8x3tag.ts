import { TagDataMap } from '../types';
import { TagType } from '../constants';

const LABEL_WIDTH = 464;
const LABEL_HEIGHT = 240;

const BARCODE_WIDTH = Math.round(LABEL_WIDTH * 0.7);
const CODE_TEXT_X = BARCODE_WIDTH;
const BARCODE_Y = 195;
const BARCODE_HEIGHT = 50;
const SUPPLIER_CODE_WIDTH = Math.round(LABEL_WIDTH * 0.4);
const SPECIAL_CODE_Y = BARCODE_Y - 27;

const get58x3TagLayout = ({
  name,
  price,
  supplierCode,
  number,
  sku,
}: TagDataMap[TagType.FIVE_EIGHT_X_THREE]) => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear() % 100).padStart(2, '0');
  // Формат: X{MM}{YY}A{цена}, например X0826A33.2
  const formattedPrice = Number(price.toFixed(1));
  const specialCode = `X${month}${year}0${formattedPrice}`;
  const title = sku ? `${sku} ${name}` : name;

  return [
    // ^XA — начало этикетки (Start Format)
    '^XA',

    // ^CI28 — кодировка UTF-8 (нужна для кириллицы)
    '^CI28',

    // ^PW — ширина этикетки в dots (Print Width)
    `^PW${LABEL_WIDTH}`,

    // ^LL — высота этикетки в dots (Label Length)
    `^LL${LABEL_HEIGHT}`,

    // Название товара (артикул перед названием, если есть):
    // ^FO x,y — позиция поля (Field Origin), x вправо, y вниз
    // ^A@N,h,w,font — Unicode TrueType шрифт:
    //   N — ориентация (Normal), h/w — высота/ширина символа, TT0003M_ — шрифт с кириллицей
    // ^TB orientation,width,height — текстовый блок с обрезкой по высоте:
    //   переносы считаются в wrapTitle (\n + дефис при разрыве слова)
    // ^FD...^FS — данные поля и конец поля (Field Data / Field Separator)
    `^FO10,10^A@N,24,24,TT0003M_^FB${LABEL_WIDTH - 20},200,0,L,0^FD${title.split('').join('\\')}^FS`,

    // Сплошной блок над штрихкодом:
    // ^GB width,height,thickness,color — прямоугольник (Graphic Box);
    //   thickness = height → заливка, W — белый, B — чёрный
    `^FO10,${SPECIAL_CODE_Y}^GB${LABEL_WIDTH},300,100,W^FS`,

    // Строка над штрихкодом: 30% код поставщика + 70% спецкод
    // Левая часть (30%) — код поставщика, например APTR
    `^FO20,${SPECIAL_CODE_Y}^A@N,28,28,TT0003M_^FB${SUPPLIER_CODE_WIDTH},1,0,L,0^FD${supplierCode}^FS`,
    // Правая часть (70%) — спецкод: X + месяц (MM) + год (YY) + A + цена, например X0826A33.2
    `^FO${SUPPLIER_CODE_WIDTH},${SPECIAL_CODE_Y}^A@N,28,28,TT0003M_^FB${LABEL_WIDTH - SUPPLIER_CODE_WIDTH},1,0,L,0^FD${specialCode}^FS`,

    // Штрихкод Code 128 (левые ~70% ширины этикетки):
    // ^FO x,y — позиция штрихкода (слева)
    // ^BY moduleWidth — ширина узкого модуля штрихкода в dots
    // ^BCN,height,showText,textAbove,checkDigit — Code 128:
    //   N — ориентация (Normal),
    //   height — высота штрихов,
    //   showText — Y/N печатать ли подпись под кодом,
    //   textAbove — Y/N подпись над кодом,
    //   checkDigit — Y/N доп. контрольная цифра UCC
    // ^FD...^FS — порядковый номер, закодированный в штрихкоде
    `^FO20,${BARCODE_Y}^BY2^BCN,${BARCODE_HEIGHT},N,N,N^FD${number}^FS`,

    // Порядковый номер справа (~30% ширины):
    // ^FO x,y — старт с правой трети этикетки
    // ^FB w,1,0,C,0 — одна строка по центру в оставшихся 30%
    // ^FD...^FS — тот же номер, что в штрихкоде
    `^FO${CODE_TEXT_X},${BARCODE_Y + 7}^A@N,28,28,TT0003M_^FB${LABEL_WIDTH - CODE_TEXT_X},1,0,C,0^FD${number}^FS`,

    '~SD25',

    // ^XZ — конец этикетки (End Format)
    '^XZ',
  ].join('\n');
};

export default get58x3TagLayout;
