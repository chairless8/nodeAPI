const jwt = require('jsonwebtoken');
const secrete_key = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  const token = authHeader.replace('Bearer ', '');

  jwt.verify(token, secrete_key, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
