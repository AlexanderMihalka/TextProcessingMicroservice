const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, isBlocked: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (error) { next(error); }
};

/**
 * PATCH /api/admin/users/:id/block
 */
const toggleBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
    if (user.role === 'ADMIN') return res.status(400).json({ error: 'Не можна заблокувати адміністратора' });

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isBlocked: !user.isBlocked },
      select: { id: true, email: true, isBlocked: true },
    });
    res.json({ user: updated });
  } catch (error) { next(error); }
};

/**
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
    if (user.role === 'ADMIN') return res.status(400).json({ error: 'Не можна видалити адміністратора' });

    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Користувача видалено' });
  } catch (error) { next(error); }
};

/**
 * PATCH /api/admin/users/:id/role
 */
const changeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) return res.status(400).json({ error: 'Невірна роль' });

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, email: true, role: true },
    });
    res.json({ user: updated });
  } catch (error) { next(error); }
};

/**
 * GET /api/admin/stats
 */
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRequests, byType, recentErrors] = await Promise.all([
      prisma.user.count(),
      prisma.request.count(),
      prisma.request.groupBy({ by: ['operationType'], _count: { id: true } }),
      prisma.log.findMany({ where: { level: 'error' }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

    const operationStats = byType.reduce((acc, item) => {
      acc[item.operationType] = item._count.id;
      return acc;
    }, {});

    res.json({ totalUsers, totalRequests, operationStats, recentErrors });
  } catch (error) { next(error); }
};

/**
 * GET /api/admin/logs
 */
const getLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.log.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.log.count(),
    ]);
    res.json({ data: logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

/**
 * DELETE /api/admin/history
 */
const clearHistory = async (req, res, next) => {
  try {
    await prisma.request.deleteMany({});
    res.json({ message: 'Історію очищено' });
  } catch (error) { next(error); }
};

module.exports = { getUsers, toggleBlock, deleteUser, changeRole, getStats, getLogs, clearHistory };
