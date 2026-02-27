const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.Controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/permissions.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et utilisateurs
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Inscription
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Connexion
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /user/checkUser:
 *   get:
 *     summary: Vérifier la validité du token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *       401:
 *         description: Token invalide
 */
router.get('/checkUser', authMiddleware, authController.checkToken);

/**
 * @swagger
 * /user/pokemon:
 *   post:
 *     summary: Test - Créer un Pokémon (admin uniquement)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Création autorisée
 *       403:
 *         description: Accès refusé
 */
router.post('/pokemon', authMiddleware, checkRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Création Pokémon autorisée (admin)' });
});

/**
 * @swagger
 * /user/myProfile:
 *   get:
 *     summary: Test - Accéder à son profil (user et admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accès autorisé
 *       403:
 *         description: Accès refusé
 */
router.get('/myProfile', authMiddleware, checkRole(['user', 'admin']), (req, res) => {
  res.status(200).json({ message: 'Accès autorisé' });
});

module.exports = router;