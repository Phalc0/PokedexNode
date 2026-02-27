const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/permissions.middleware');
const pkmnController = require('../controllers/Pkmn.controller');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Pokemon
 *   description: Gestion des Pokémon
 */

/**
 * @swagger
 * /pkmn:
 *   post:
 *     summary: Créer un Pokémon
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pokémon créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', pkmnController.createPkmn);

/**
 * @swagger
 * /pkmn/region:
 *   post:
 *     summary: Ajouter une région à un Pokémon
 *     tags: [Pokemon]
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
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Région ajoutée
 *       401:
 *         description: Non autorisé
 */
router.post('/region', pkmnController.addRegion);

/**
 * @swagger
 * /pkmn:
 *   get:
 *     summary: Rechercher des Pokémon
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nom du Pokémon
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type du Pokémon
 *     responses:
 *       200:
 *         description: Liste des Pokémon
 *       401:
 *         description: Non autorisé
 */
router.get('/', pkmnController.search);

/**
 * @swagger
 * /pkmn/{id}:
 *   get:
 *     summary: Récupérer un Pokémon par ID
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokémon trouvé
 *       404:
 *         description: Pokémon non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', pkmnController.getPkmnById);

/**
 * @swagger
 * /pkmn:
 *   put:
 *     summary: Modifier un Pokémon (admin uniquement)
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pokémon mis à jour
 *       403:
 *         description: Accès refusé
 */
router.put('/', checkRole(['admin']), pkmnController.updatePkmn);

/**
 * @swagger
 * /pkmn/{id}:
 *   delete:
 *     summary: Supprimer un Pokémon (admin uniquement)
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokémon supprimé
 *       403:
 *         description: Accès refusé
 */
router.delete('/:id', checkRole(['admin']), pkmnController.deletePkmn);

/**
 * @swagger
 * /pkmn/region:
 *   delete:
 *     summary: Supprimer une région (admin uniquement)
 *     tags: [Pokemon]
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
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Région supprimée
 *       403:
 *         description: Accès refusé
 */
router.delete('/region', checkRole(['admin']), pkmnController.deleteRegion);

module.exports = router;