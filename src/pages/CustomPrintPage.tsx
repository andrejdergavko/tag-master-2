import { useMemo, useState } from 'react';
import {
  Button,
  Input,
  InputNumber,
  Segmented,
  Select,
  Typography,
  message,
} from 'antd';
import {
  DEFAULT_TAG_TYPE,
  TAG_TYPE_LABELS,
} from '../services/printer/constants';
import {
  getCustomTagFontOptions,
  getCustomTagLayout,
  normalizeCustomTagText,
} from '../services/printer/tagLayouts/customTag';
import { buildDocumentTagTitle } from '../services/printer/tagTitle';
import { sanitizeProductName } from '../services/printer/sanitizeProductName';
import { useGetTagType } from '../modules/printer/hooks/useGetTagType';
import { usePrintCustomTags } from '../modules/printer/hooks/usePrintCustomTags';

const { TextArea } = Input;

const RECENT_STORAGE_KEY = 'custom-print-recent';
const RECENT_LIMIT = 8;
const PREVIEW_WIDTH = 360;
const FORM_WIDTH = 360;
const DOCUMENT_TITLE_FONT = 22;

type PrintMode = 'text' | 'price';

const readRecent = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is string => typeof item === 'string')
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
};

const rememberRecent = (text: string, current: string[]): string[] => {
  const next = [text, ...current.filter((item) => item !== text)].slice(
    0,
    RECENT_LIMIT,
  );
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
  return next;
};

const recentLabel = (text: string): string => {
  const oneLine = text.replace(/\s+/g, ' ');
  if (oneLine.length <= 40) return oneLine;
  return `${oneLine.slice(0, 40)}…`;
};

export default function CustomPrintPage() {
  const { data: tagType = DEFAULT_TAG_TYPE } = useGetTagType();
  const { mutateAsync: printCustomTags, isPending } = usePrintCustomTags();
  const [mode, setMode] = useState<PrintMode>('text');
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [copies, setCopies] = useState<number | null>(1);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [recent, setRecent] = useState<string[]>(readRecent);

  const printable = normalizeCustomTagText(text);
  const cleanName = sanitizeProductName(normalizeCustomTagText(name));
  const priceSuffix = useMemo(
    () => String(Math.floor(Math.random() * 100)).padStart(2, '0'),
    [price],
  );
  const priceTitle =
    cleanName && price != null
      ? buildDocumentTagTitle(cleanName, price, undefined, {
          randomSuffix: priceSuffix,
        })
      : '';
  const activeText = mode === 'text' ? printable : priceTitle;
  const fontOptions = getCustomTagFontOptions(tagType);
  const manualFontSize = fontOptions.some((option) => option.size === fontSize)
    ? fontSize
    : null;
  const layoutFont =
    mode === 'price' ? (manualFontSize ?? DOCUMENT_TITLE_FONT) : manualFontSize;
  const layout = getCustomTagLayout(
    tagType,
    activeText,
    layoutFont ?? undefined,
  );
  const scale = PREVIEW_WIDTH / layout.width;
  const canPrint = Boolean(activeText) && copies != null && copies >= 1;
  const canClear = mode === 'text' ? Boolean(text) : Boolean(name) || price != null;

  const handleClear = () => {
    if (mode === 'text') {
      setText('');
      return;
    }

    setName('');
    setPrice(null);
  };

  const handlePrint = async () => {
    if (!canPrint || copies == null) return;

    try {
      await printCustomTags({
        text: activeText,
        copies,
        fontSize: layoutFont ?? undefined,
      });
      if (mode === 'text') {
        setRecent((current) => rememberRecent(printable, current));
      }
    } catch {
      message.error('Не удалось напечатать этикетку');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <Typography.Text type="secondary">
        Этикетка {TAG_TYPE_LABELS[tagType]}
      </Typography.Text>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div
          style={{
            width: PREVIEW_WIDTH,
            height: layout.height * scale,
            boxSizing: 'border-box',
            flexShrink: 0,
            padding: layout.padding * scale,
            background: '#fff',
            outline: '1px solid #d9d9d9',
            overflow: 'hidden',
            fontSize: layout.fontSize * scale,
            lineHeight: `${layout.fontSize * scale}px`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {activeText}
        </div>
        <div
          style={{
            width: FORM_WIDTH,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <Segmented
            value={mode}
            options={[
              { label: 'Текст', value: 'text' },
              { label: 'Наименование и цена', value: 'price' },
            ]}
            onChange={(value) => setMode(value as PrintMode)}
          />
          {mode === 'text' ? (
            <TextArea
              value={text}
              placeholder="Текст этикетки"
              autoFocus
              rows={3}
              style={{ resize: 'none', flex: 'none' }}
              onChange={(event) => setText(event.target.value)}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                value={name}
                placeholder="Наименование"
                autoFocus
                onChange={(event) => setName(event.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>Цена</span>
                <InputNumber
                  min={0}
                  step={0.1}
                  value={price}
                  style={{ width: 140 }}
                  onChange={(value) => setPrice(value)}
                />
              </div>
            </div>
          )}
          {activeText && !layout.fits && (
            <Typography.Text type="warning">
              Текст может не поместиться на этикетке
            </Typography.Text>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Шрифт</span>
              <Select
                style={{ width: 160 }}
                value={manualFontSize ?? 'auto'}
                options={[
                  { value: 'auto', label: 'Авто' },
                  ...fontOptions.map((option) => ({
                    value: option.size,
                    label: option.label,
                  })),
                ]}
                onChange={(value) => {
                  setFontSize(value === 'auto' ? null : Number(value));
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Количество</span>
              <InputNumber
                min={1}
                max={99}
                precision={0}
                value={copies}
                onChange={(value) => setCopies(value)}
              />
            </div>
          </div>
          {mode === 'text' && recent.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recent.map((item) => (
                <Button
                  key={item}
                  title={item}
                  onClick={() => setText(item)}
                >
                  {recentLabel(item)}
                </Button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button disabled={!canClear} onClick={handleClear}>
              Очистить
            </Button>
            <Button
              type="primary"
              disabled={!canPrint}
              loading={isPending}
              onClick={() => void handlePrint()}
            >
              Распечатать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
