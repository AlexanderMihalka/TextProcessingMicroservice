const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Токен авторизації відсутній' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'Користувача не знайдено' });
    if (user.isBlocked) return res.status(403).json({ error: 'Акаунт заблоковано' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недійсний токен авторизації' });
  }
};

module.exports = authMiddleware;
