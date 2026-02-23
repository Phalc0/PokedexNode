const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'monsecret123';

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw 'Token manquant';

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);

    req.auth = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  } catch(err) {
    res.status(401).json({ message: 'Authentification échouée', error: err });
  }
};