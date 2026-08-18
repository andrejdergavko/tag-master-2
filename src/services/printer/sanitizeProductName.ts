const WORDS_TO_REMOVE = ['китай'];

export const sanitizeProductName = (name: string): string => {
  const wordPattern = new RegExp(
    `(?<!\\p{L})(?:${WORDS_TO_REMOVE.join('|')})(?!\\p{L})`,
    'giu',
  );

  return name.replace(wordPattern, '').trim();
};
