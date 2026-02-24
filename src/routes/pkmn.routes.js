const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware'); // for authentification
const { checkRole } = require('../middlewares/permissions.middleware'); // for permissions
const pkmnController = require('../controllers/Pkmn.controller');

// Apply auth middleware to all routes in this router
router.use(authMiddleware); 

// Routes for user and admin
router.post('/', pkmnController.createPkmn);
router.post('/region', pkmnController.addRegion);
router.get('/', pkmnController.search);
router.get('/:id', pkmnController.getPkmnById);


// Routes for admin only
router.put('/', checkRole(['admin']), pkmnController.updatePkmn);
router.delete('/:id', checkRole(['admin']), pkmnController.deletePkmn);
router.delete('/region', checkRole(['admin']), pkmnController.deleteRegion);


module.exports = router;