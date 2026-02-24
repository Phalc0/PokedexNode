const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/td')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log(err));

// Routes
const pkmnTypeRoutes = require('./routes/PkmnType.routes'); // /pkmn/types
const userRoutes = require('./routes/user.routes');         // /users
const pkmnRoutes = require('./routes/pkmn.routes');   // /pkmn CRUD Pokemons
const trainerRoutes = require('./routes/trainer.routes');   // /trainers CRUD Trainers

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/pkmn/types', pkmnTypeRoutes);
app.use('/users', userRoutes);
app.use('/pkmn', pkmnRoutes);
app.use('/trainers', trainerRoutes);

module.exports = app;