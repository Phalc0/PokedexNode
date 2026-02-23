const express = require('express')
const app = express()

const path = require('path');

const pkmnTypeRoutes = require('./routes/PkmnType.routes');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/pkmn', pkmnTypeRoutes);

module.exports = app;