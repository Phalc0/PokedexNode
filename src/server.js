const express = require('express');
const app = require('./app');
const port = 3000;

const mainApp = express();

// Préfixe toutes les routes avec /api
mainApp.use('/api', app);

mainApp.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/api`);
});