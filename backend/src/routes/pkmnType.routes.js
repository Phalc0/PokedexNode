const express = require('express');
const router = express.Router();
const pkmnTypeController = require('../controllers/PkmnType.controller');

/**
 * @swagger
 * tags:
 *   name: PokemonTypes
 *   description: Types de Pokémon
 */

/**
 * @swagger
 * /pkmntype:
 *   get:
 *     summary: Récupérer tous les types de Pokémon
 *     tags: [PokemonTypes]
 *     responses:
 *       200:
 *         description: Liste des types
 */
router.get('/', pkmnTypeController.getAllTypes);

module.exports = router;