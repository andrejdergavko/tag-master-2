import { Prisma } from '../../../generated/prisma/client';
import { getYandexApiKey, getYandexFolderId } from '../config/configService';
import { getPrisma } from '../db/prisma';

const EMBEDDING_URL =
  'https://llm.api.cloud.yandex.net/foundationModels/v1/textEmbedding';
const EMBEDDING_DIM = 768;
const DOC_MODEL = 'text-embeddings-v2-doc';
const QUERY_MODEL = 'text-embeddings-v2-query';

const toVectorLiteral = (embedding: number[]): string =>
  `[${embedding.join(',')}]`;

const getYandexConfig = () => {
  const apiKey = getYandexApiKey()?.trim();
  const folderId = getYandexFolderId()?.trim().replace(/^['"]|['"]$/g, '');

  if (!apiKey || !folderId) {
    throw new Error(
      'API-ключ и ID каталога Yandex Cloud должны быть заданы в настройках',
    );
  }

  return { apiKey, folderId };
};

const embedText = async (text: string, model: string): Promise<number[]> => {
  const { apiKey, folderId } = getYandexConfig();
  const response = await fetch(EMBEDDING_URL, {
    method: 'POST',
    headers: {
      Authorization: `Api-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelUri: `emb://${folderId}/${model}/latest`,
      text,
      dim: EMBEDDING_DIM,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Yandex embeddings failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { embedding?: number[] };
  if (!data.embedding || data.embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Yandex embedding has unexpected length ${data.embedding?.length ?? 0}`,
    );
  }

  return data.embedding;
};

const embedDocumentName = (text: string): Promise<number[]> =>
  embedText(text, DOC_MODEL);

export const embedQueryText = (text: string): Promise<number[]> =>
  embedText(text, QUERY_MODEL);

const uniqueNames = (names: string[]): string[] => [
  ...new Set(names.map((name) => name.trim()).filter(Boolean)),
];

const copyExistingEmbeddings = async (names: string[]): Promise<void> => {
  if (names.length === 0) return;

  await getPrisma().$executeRaw`
    UPDATE "DocumentItem" AS target
    SET "nameEmbedding" = source."nameEmbedding"
    FROM (
      SELECT DISTINCT ON ("name") "name", "nameEmbedding"
      FROM "DocumentItem"
      WHERE "nameEmbedding" IS NOT NULL
        AND "name" IN (${Prisma.join(names)})
    ) AS source
    WHERE target."name" = source."name"
      AND target."nameEmbedding" IS NULL
  `;
};

const namesMissingEmbeddings = async (names: string[]): Promise<string[]> => {
  if (names.length === 0) return [];

  const rows = await getPrisma().$queryRaw<{ name: string }[]>`
    SELECT DISTINCT "name"
    FROM "DocumentItem"
    WHERE "nameEmbedding" IS NULL
      AND "name" IN (${Prisma.join(names)})
  `;

  return rows.map((row) => row.name);
};

const saveEmbeddingForName = async (
  name: string,
  embedding: number[],
): Promise<void> => {
  const vector = toVectorLiteral(embedding);
  await getPrisma().$executeRaw`
    UPDATE "DocumentItem"
    SET "nameEmbedding" = ${vector}::vector
    WHERE "name" = ${name}
      AND "nameEmbedding" IS NULL
  `;
};

export const saveNameEmbeddings = async (names: string[]): Promise<void> => {
  try {
    const namesToEmbed = uniqueNames(names);
    if (namesToEmbed.length === 0) return;

    await copyExistingEmbeddings(namesToEmbed);

    const missing = await namesMissingEmbeddings(namesToEmbed);
    for (const name of missing) {
      try {
        const embedding = await embedDocumentName(name);
        await saveEmbeddingForName(name, embedding);
      } catch (error) {
        console.error(`Failed to embed document item name "${name}"`, error);
      }
    }
  } catch (error) {
    console.error('Failed to save name embeddings', error);
  }
};

export const backfillMissingNameEmbeddings = async (): Promise<void> => {
  const rows = await getPrisma().$queryRaw<{ name: string }[]>`
    SELECT DISTINCT "name"
    FROM "DocumentItem"
    WHERE "nameEmbedding" IS NULL
  `;

  await saveNameEmbeddings(rows.map((row) => row.name));
};
