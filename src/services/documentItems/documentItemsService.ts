import { Prisma } from '../../../generated/prisma/client';
import { getPrisma } from '../db/prisma';
import {
  GetDocumentItemsParams,
  GetDocumentItemsResult,
  SupplierId,
} from '../../shared/types';

export const getDocumentItems = async (
  params: GetDocumentItemsParams,
): Promise<GetDocumentItemsResult> => {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 100, 500));
  const search = params.search?.trim();

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
    items: items.map((item) => ({
      id: item.id,
      sku: item.sku ?? undefined,
      name: item.name,
      units: item.units,
      quantity: item.quantity,
      sumWithVat: Number(item.sumWithVat),
      printedAt: item.printedAt?.toISOString() ?? null,
      documentId: item.documentId,
      documentNumber: item.document.number,
      documentDate: item.document.date?.toISOString() ?? null,
      supplierId: item.document.supplierId as SupplierId,
      supplierName: item.document.supplier.name,
    })),
  };
};
