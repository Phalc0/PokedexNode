module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.auth.role)) {
    return res.status(403).json({ message: 'Permission refusée' });
  }
  next();
};