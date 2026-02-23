const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permissions = require('../middlewares/permissions.middleware');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);


// Vérifie que le token est valide
router.get('/checkUser', authMiddleware, authController.checkToken);


// Exemple : création Pokémon → ADMIN uniquement
router.post(
  '/pokemon',
  authMiddleware,
  permissions(['ADMIN']),
  (req, res) => {
    res.status(200).json({
      message: 'Création Pokémon autorisée (ADMIN)'
    });
  }
);

// Exemple : route accessible USER et ADMIN
router.get(
  '/myProfile',
  authMiddleware,
  permissions(['USER', 'ADMIN']),
  (req, res) => {
    res.status(200).json({
      message: 'Accès autorisé'
    });
  }
);

module.exports = router;