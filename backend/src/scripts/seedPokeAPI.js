const axios = require('axios');
const mongoose = require('mongoose');
const Pkmn = require('../models/Pkmn.model');

mongoose.connect('mongodb://127.0.0.1:27017/td')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function fetchPokemon(id) {
    try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = res.data;

        return {
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            types: data.types.map(t => t.type.name.toUpperCase()), 
            imgUrl: data.sprites.other['official-artwork'].front_default,
            description: `A Pokémon of type ${data.types.map(t => t.type.name).join(', ')}`,
            regions: [],
        };
    } catch (err) {
        console.error('Erreur fetch Pokemon', id, err.message);
        return null;
    }
}

async function seed() {
    // Supprime les anciens Pokémon
    await Pkmn.deleteMany();

    // Exemple : récupérer les 50 premiers Pokémon
    const pokemons = [];
    for (let i = 1; i <= 50; i++) {
        const p = await fetchPokemon(i);
        if (p) pokemons.push(p);
    }

    await Pkmn.insertMany(pokemons);
    console.log(`${pokemons.length} Pokémon ajoutés !`);
    mongoose.disconnect();
}

seed();