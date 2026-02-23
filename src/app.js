const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/td')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log(err));

const pkmnTypeRoutes = require('./routes/PkmnType.routes');
const userRoutes = require('./routes/user.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/pkmn', pkmnTypeRoutes);       // accessible sur http://localhost:3000/pkmn
app.use('/users', userRoutes);          // accessible sur http://localhost:3000/users

module.exports = app;