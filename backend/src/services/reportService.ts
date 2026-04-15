import { prisma } from '../config/database';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateRange(startDate?: string, endDate?: string): { start: Date; end: Date } {
  const now = new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate
    ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

// ─── Summary (Dashboard KPIs) ─────────────────────────────────────────────────

export async function getSummary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthlyOrders, allOrdersAgg, activeClients, activeProducts, statusGroups] =
    await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELADO' } },
        select: { total: true, status: true },
      }),
      prisma.order.aggregate({
        where: { status: { not: 'CANCELADO' } },
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.client.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
    ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monthlyRevenue = (monthlyOrders as any[]).reduce((sum: number, o: any) => sum + Number(o.total), 0);
  const monthlyOrderCount = monthlyOrders.length;
  const avgTicket = monthlyOrderCount > 0 ? monthlyRevenue / monthlyOrderCount : 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveredThisMonth = (monthlyOrders as any[]).filter((o: any) => o.status === 'ENTREGUE').length;

  const ordersByStatus: Record<string, number> = {};
  for (const sg of statusGroups) {
    ordersByStatus[sg.status] = sg._count.id;
  }

  type LowStockRow = { count: bigint };
  const [lowStockResult] = await prisma.$queryRaw<LowStockRow[]>`
    SELECT COUNT(*) as count FROM packagings WHERE currentStock <= minimumStock
  `;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      client: { select: { id: true, razaoSocial: true, nomeFantasia: true } },
    },
  });

  return {
    currentMonth: {
      orders: monthlyOrderCount,
      revenue: monthlyRevenue,
      avgTicket,
      deliveredOrders: deliveredThisMonth,
    },
    allTime: {
      totalOrders: allOrdersAgg._count.id,
      totalRevenue: Number(allOrdersAgg._sum.total ?? 0),
      activeClients,
      activeProducts,
    },
    ordersByStatus,
    lowStockPackagings: Number(lowStockResult.count),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentOrders: (recentOrders as any[]).map((o: any) => ({ ...o, total: Number(o.total) })),
  };
}

// ─── Sales Over Time ──────────────────────────────────────────────────────────

export async function getSalesOverTime(
  startDate?: string,
  endDate?: string,
  groupBy: 'day' | 'week' | 'month' = 'day',
) {
  const { start, end } = getDateRange(startDate, endDate);
  const formatMap = { day: '%Y-%m-%d', week: '%x-W%v', month: '%Y-%m' };
  const fmt = formatMap[groupBy];

  type SalesRow = { period: string; orders: bigint; revenue: string };
  const rows = await prisma.$queryRaw<SalesRow[]>`
    SELECT
      DATE_FORMAT(createdAt, ${fmt}) as period,
      COUNT(*) as orders,
      CAST(SUM(total) AS CHAR) as revenue
    FROM orders
    WHERE createdAt >= ${start} AND createdAt <= ${end} AND status != 'CANCELADO'
    GROUP BY period
    ORDER BY MIN(createdAt) ASC
  `;

  return rows.map((r) => ({
    period: r.period,
    orders: Number(r.orders),
    revenue: parseFloat(r.revenue ?? '0'),
  }));
}

// ─── Top Products ─────────────────────────────────────────────────────────────

export async function getTopProducts(startDate?: string, endDate?: string, limit = 10) {
  const { start, end } = getDateRange(startDate, endDate);

  type ProductRow = {
    productId: string;
    name: string;
    code: string;
    totalQuantity: bigint;
    totalRevenue: string;
    orderCount: bigint;
  };
  const rows = await prisma.$queryRaw<ProductRow[]>`
    SELECT
      oi.product_id as productId,
      p.name,
      p.code,
      SUM(oi.quantity) as totalQuantity,
      CAST(SUM(oi.subtotal) AS CHAR) as totalRevenue,
      COUNT(DISTINCT oi.order_id) as orderCount
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.createdAt >= ${start} AND o.createdAt <= ${end} AND o.status != 'CANCELADO'
    GROUP BY oi.product_id, p.name, p.code
    ORDER BY SUM(oi.subtotal) DESC
    LIMIT ${limit}
  `;

  return rows.map((r) => ({
    productId: r.productId,
    name: r.name,
    code: r.code,
    totalQuantity: Number(r.totalQuantity),
    totalRevenue: parseFloat(r.totalRevenue ?? '0'),
    orderCount: Number(r.orderCount),
  }));
}

// ─── Top Clients ──────────────────────────────────────────────────────────────

export async function getTopClients(startDate?: string, endDate?: string, limit = 10) {
  const { start, end } = getDateRange(startDate, endDate);

  type ClientRow = {
    clientId: string;
    razaoSocial: string;
    nomeFantasia: string;
    orderCount: bigint;
    totalRevenue: string;
  };
  const rows = await prisma.$queryRaw<ClientRow[]>`
    SELECT
      o.client_id as clientId,
      c.razaoSocial,
      c.nomeFantasia,
      COUNT(*) as orderCount,
      CAST(SUM(o.total) AS CHAR) as totalRevenue
    FROM orders o
    JOIN clients c ON c.id = o.client_id
    WHERE o.createdAt >= ${start} AND o.createdAt <= ${end} AND o.status != 'CANCELADO'
    GROUP BY o.client_id, c.razaoSocial, c.nomeFantasia
    ORDER BY SUM(o.total) DESC
    LIMIT ${limit}
  `;

  return rows.map((r) => ({
    clientId: r.clientId,
    razaoSocial: r.razaoSocial,
    nomeFantasia: r.nomeFantasia,
    orderCount: Number(r.orderCount),
    totalRevenue: parseFloat(r.totalRevenue ?? '0'),
  }));
}

// ─── Packaging Analysis ───────────────────────────────────────────────────────

export async function getPackagingAnalysis() {
  type PackRow = {
    id: string;
    name: string;
    type: string;
    currentStock: number;
    minimumStock: number;
    consumedLast30Days: bigint;
  };

  const rows = await prisma.$queryRaw<PackRow[]>`
    SELECT
      pk.id,
      pk.name,
      pk.type,
      pk.currentStock,
      pk.minimumStock,
      COALESCE(SUM(oi.quantity), 0) as consumedLast30Days
    FROM packagings pk
    LEFT JOIN products pr ON pr.packaging_id = pk.id
    LEFT JOIN order_items oi ON oi.product_id = pr.id
    LEFT JOIN orders o ON o.id = oi.order_id
      AND o.status IN ('PROCESSANDO', 'PRODUCAO', 'PREPARADO', 'ENVIADO', 'ENTREGUE')
      AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY pk.id, pk.name, pk.type, pk.currentStock, pk.minimumStock
    ORDER BY (pk.currentStock - pk.minimumStock) ASC
  `;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    currentStock: Number(r.currentStock),
    minimumStock: Number(r.minimumStock),
    needsReorder: Number(r.currentStock) <= Number(r.minimumStock),
    consumedLast30Days: Number(r.consumedLast30Days),
  }));
}
