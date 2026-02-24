const express = require('express');
const router = express.Router();


const pkmnTypeController = require('../controllers/PkmnType.controller');

router.get('/', pkmnTypeController.getAllTypes);

module.exports = router;