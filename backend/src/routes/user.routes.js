const express = require('express');
const router = express.Router();

const authController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/permissions.middleware');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);


// Vérifie que le token est valide
router.get('/checkUser', authMiddleware, authController.checkToken);


// Route Test : création Pokémon → ADMIN uniquement
router.post(
  '/pokemon',
  authMiddleware,
  checkRole(['admin']),
  (req, res) => {
    res.status(200).json({
      message: 'Création Pokémon autorisée (admin)'
    });
  }
);

// Route Test : route accessible USER et ADMIN
router.get(
  '/myProfile',
  authMiddleware,
  checkRole(['user', 'admin']),
  (req, res) => {
    res.status(200).json({
      message: 'Accès autorisé'
    });
  }
);

module.exports = router;