const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const permissions = require('../middlewares/permissions.middleware');

// Public
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protégé
router.get('/checkUser', auth, userController.checkUser);

// Exemple : route admin uniquement
router.post('/createPokemon', auth, permissions(['admin']), (req, res) => {
  res.json({ message: 'Création Pokémon autorisée !' });
});

module.exports = router;