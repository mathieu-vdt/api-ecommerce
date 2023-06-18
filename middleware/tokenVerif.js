const jwt = require('jsonwebtoken');

const tokenVerif = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, 'maSuperCle');
      req.user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ mess: "Token invalide" });
      } else {
        res.status(500).json({ mess: "Erreur interne du serveur" });
      }
    }
  };

module.exports = tokenVerif