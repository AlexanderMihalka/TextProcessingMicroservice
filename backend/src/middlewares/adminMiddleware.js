const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Доступ заборонено. Потрібні права адміністратора.' });
  }
  next();
};

module.exports = adminMiddleware;
