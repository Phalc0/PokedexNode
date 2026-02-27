const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/Trainer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Trainer
 *   description: Gestion des dresseurs
 */

/**
 * @swagger
 * /trainer:
 *   post:
 *     summary: Créer un dresseur
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dresseur créé
 */
router.post('/', authMiddleware, trainerController.createTrainer);

/**
 * @swagger
 * /trainer:
 *   get:
 *     summary: Récupérer son profil dresseur
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil dresseur
 *       401:
 *         description: Non autorisé
 */
router.get('/', authMiddleware, trainerController.getTrainerById);

/**
 * @swagger
 * /trainer:
 *   put:
 *     summary: Modifier son profil dresseur
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put('/', authMiddleware, trainerController.updateTrainer);

/**
 * @swagger
 * /trainer:
 *   delete:
 *     summary: Supprimer son profil dresseur
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil supprimé
 */
router.delete('/', authMiddleware, trainerController.deleteTrainer);

/**
 * @swagger
 * /trainer/username/{username}:
 *   get:
 *     summary: Récupérer un dresseur par username
 *     tags: [Trainer]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dresseur trouvé
 *       404:
 *         description: Dresseur non trouvé
 */
router.get('/username/:username', trainerController.getTrainerByUsername);

/**
 * @swagger
 * /trainer/markPkmn:
 *   post:
 *     summary: Marquer un Pokémon comme capturé
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pkmnId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pokémon marqué
 */
router.post('/markPkmn', authMiddleware, trainerController.markPkmn);

module.exports = router;