import { useState } from 'react';
import { Button, Input, InputNumber, Select, Typography, message } from 'antd';
import {
  DEFAULT_TAG_TYPE,
  TAG_TYPE_LABELS,
} from '../services/printer/constants';
import {
  getCustomTagFontOptions,
  getCustomTagLayout,
  normalizeCustomTagText,
} from '../services/printer/tagLayouts/customTag';
import { useGetTagType } from '../modules/printer/hooks/useGetTagType';
import { usePrintCustomTags } from '../modules/printer/hooks/usePrintCustomTags';

const { TextArea } = Input;

const RECENT_STORAGE_KEY = 'custom-print-recent';
const RECENT_LIMIT = 8;
const PREVIEW_WIDTH = 360;

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
  const [text, setText] = useState('');
  const [copies, setCopies] = useState<number | null>(1);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [recent, setRecent] = useState<string[]>(readRecent);

  const printable = normalizeCustomTagText(text);
  const fontOptions = getCustomTagFontOptions(tagType);
  const manualFontSize = fontOptions.some((option) => option.size === fontSize)
    ? fontSize
    : null;
  const layout = getCustomTagLayout(
    tagType,
    printable,
    manualFontSize ?? undefined,
  );
  const scale = PREVIEW_WIDTH / layout.width;
  const canPrint = Boolean(printable) && copies != null && copies >= 1;

  const handlePrint = async () => {
    if (!canPrint || copies == null) return;

    try {
      await printCustomTags({
        text: printable,
        copies,
        fontSize: manualFontSize ?? undefined,
      });
      setRecent((current) => rememberRecent(printable, current));
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
        height: '100%',
        minHeight: 0,
      }}
    >
      <Typography.Text type="secondary">
        Этикетка {TAG_TYPE_LABELS[tagType]}
      </Typography.Text>
      <div style={{ display: 'flex', gap: 24, minHeight: 0, flex: 1 }}>
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
          {printable}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <TextArea
            value={text}
            placeholder="Текст этикетки"
            autoFocus
            rows={3}
            style={{ resize: 'none', flex: 'none' }}
            onChange={(event) => setText(event.target.value)}
          />
          {printable && !layout.fits && (
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
          {recent.length > 0 && (
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
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button disabled={!text} onClick={() => setText('')}>
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
  );
}
