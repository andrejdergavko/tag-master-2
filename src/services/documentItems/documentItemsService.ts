import { Prisma } from '../../../generated/prisma/client';
import { getPrisma } from '../db/prisma';
import { embedQueryText } from '../embeddings/embeddingsService';
import {
  GetDocumentItemsParams,
  GetDocumentItemsResult,
  SupplierId,
} from '../../shared/types';

type SemanticItemRow = {
  id: number;
  sku: string | null;
  name: string;
  units: string;
  quantity: number;
  sumWithVat: Prisma.Decimal | string | number;
  printedAt: Date | null;
  documentId: string;
  documentNumber: string | null;
  documentDate: Date | null;
  supplierId: string;
  supplierName: string;
};

const toItemRow = (item: SemanticItemRow) => ({
  id: item.id,
  sku: item.sku ?? undefined,
  name: item.name,
  units: item.units,
  quantity: item.quantity,
  sumWithVat: Number(item.sumWithVat),
  printedAt: item.printedAt?.toISOString() ?? null,
  documentId: item.documentId,
  documentNumber: item.documentNumber,
  documentDate: item.documentDate?.toISOString() ?? null,
  supplierId: item.supplierId as SupplierId,
  supplierName: item.supplierName,
});

const buildDocumentFilters = (params: GetDocumentItemsParams): Prisma.Sql[] => {
  const conditions: Prisma.Sql[] = [
    Prisma.sql`di."nameEmbedding" IS NOT NULL`,
  ];

  if (params.supplierIds?.length) {
    conditions.push(
      Prisma.sql`d."supplierId" IN (${Prisma.join(params.supplierIds)})`,
    );
  }

  if (params.dateFrom) {
    conditions.push(Prisma.sql`d.date >= ${new Date(params.dateFrom)}`);
  }

  if (params.dateTo) {
    conditions.push(Prisma.sql`d.date <= ${new Date(params.dateTo)}`);
  }

  return conditions;
};

const getDocumentItemsSemantic = async (
  params: GetDocumentItemsParams,
  search: string,
): Promise<GetDocumentItemsResult> => {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 100, 500));
  const embedding = await embedQueryText(search);
  const vector = `[${embedding.join(',')}]`;
  const whereSql = Prisma.sql`WHERE ${Prisma.join(buildDocumentFilters(params), ' AND ')}`;

  const [items, totalRows] = await Promise.all([
    getPrisma().$queryRaw<SemanticItemRow[]>`
      SELECT
        di.id,
        di.sku,
        di.name,
        di.units,
        di.quantity,
        di."sumWithVat",
        di."printedAt",
        di."documentId",
        d.number AS "documentNumber",
        d.date AS "documentDate",
        d."supplierId",
        s.name AS "supplierName"
      FROM "DocumentItem" di
      INNER JOIN "Document" d ON d.id = di."documentId"
      INNER JOIN "Supplier" s ON s.id = d."supplierId"
      ${whereSql}
      ORDER BY di."nameEmbedding" <=> ${vector}::vector
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `,
    getPrisma().$queryRaw<[{ count: number | bigint }]>`
      SELECT COUNT(*)::int AS count
      FROM "DocumentItem" di
      INNER JOIN "Document" d ON d.id = di."documentId"
      ${whereSql}
    `,
  ]);

  return {
    total: Number(totalRows[0]?.count ?? 0),
    items: items.map(toItemRow),
  };
};

export const getDocumentItems = async (
  params: GetDocumentItemsParams,
): Promise<GetDocumentItemsResult> => {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 100, 500));
  const search = params.search?.trim();

  if (params.semanticSearch && search) {
    return getDocumentItemsSemantic(params, search);
  }

  const documentFilter: Prisma.DocumentWhereInput = {};

  if (params.supplierIds?.length) {
    documentFilter.supplierId = { in: params.supplierIds };
  }

  if (params.dateFrom || params.dateTo) {
    documentFilter.date = {};
    if (params.dateFrom) {
      documentFilter.date.gte = new Date(params.dateFrom);
    }
    if (params.dateTo) {
      documentFilter.date.lte = new Date(params.dateTo);
    }
  }

  const where: Prisma.DocumentItemWhereInput = {
    ...(Object.keys(documentFilter).length > 0
      ? { document: documentFilter }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    getPrisma().documentItem.findMany({
      where,
      include: {
        document: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: [{ document: { date: 'desc' } }, { id: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    getPrisma().documentItem.count({ where }),
  ]);

  return {
    total,
    items: items.map((item) =>
      toItemRow({
        id: item.id,
        sku: item.sku,
        name: item.name,
        units: item.units,
        quantity: item.quantity,
        sumWithVat: item.sumWithVat,
        printedAt: item.printedAt,
        documentId: item.documentId,
        documentNumber: item.document.number,
        documentDate: item.document.date,
        supplierId: item.document.supplierId,
        supplierName: item.document.supplier.name,
      }),
    ),
  };
};
