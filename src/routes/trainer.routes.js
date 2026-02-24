const express = require('express');
const router = express.Router();

const trainerController = require('../controllers/Trainer.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // for authentification

router.post('/', authMiddleware, trainerController.createTrainer);
router.get('/', authMiddleware, trainerController.getTrainerById);
router.put('/', authMiddleware, trainerController.updateTrainer);
router.delete('/', authMiddleware, trainerController.deleteTrainer);

router.post('/markPkmn', authMiddleware, trainerController.markPkmn);

module.exports = router;