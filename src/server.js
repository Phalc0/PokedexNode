const express = require('express');
const app = require('./app');
const port = 3000


const router = express.Router();
router.use('/', app); // use the app routes under the /api prefix

const mainApp = express();
mainApp.use('/api', router); // prefix all routes with /api

mainApp.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/api`);
});