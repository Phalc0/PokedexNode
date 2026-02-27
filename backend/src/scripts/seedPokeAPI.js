const axios = require('axios');
const mongoose = require('mongoose');
const Pkmn = require('../models/Pkmn.model');

const MONGO_URI = 'mongodb://127.0.0.1:27017/td';
const BATCH_SIZE = 10; //number of items per batch
const BATCH_DELAY = 300; // ms between batch

// create pauses to avoid being rate limited by the API
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function connectDB() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
}

async function fetchAllPokemonList() {
    const res = await axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=2000'
    );
    return res.data.results; // [{ name, url }]
}


async function fetchPokemonDetails(url) {
    try {
        const res = await axios.get(url);
        const data = res.data;

        return {
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            types: data.types.map(t => t.type.name.toUpperCase()),
            imgUrl: data.sprites.other['official-artwork'].front_default,
            description: `A Pokémon of type ${data.types.map(t => t.type.name).join(', ')}`,
            regions: [],
        };
    } catch (err) {
        console.error('❌ Fetch error:', err.message);
        return null;
    }
}


// Manage a list of items to optimize performances
// So it will inject 10 by 10 pokemons in database to avoid saturated request
async function processInBatches(items, batchSize) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        console.log(
            `⚙️ Batch ${Math.floor(i / batchSize) + 1} / ${Math.ceil(items.length / batchSize)}`
        );

        const batchResults = await Promise.all(
            batch.map(item => fetchPokemonDetails(item.url))
        );

        results.push(...batchResults.filter(Boolean));

        await sleep(BATCH_DELAY);
    }

    return results;
}

// Seed

async function seedAllPokemon() {
    try {
        await connectDB();

        console.log('Clearing collection...');
        await Pkmn.deleteMany({});

        console.log('Fetching Pokémon list...');
        const list = await fetchAllPokemonList();
        console.log(`✔ ${list.length} Pokémon found`);
        const results = await processInBatches(list, BATCH_SIZE);
        await Pkmn.insertMany(results, { ordered: false });

        console.log(`${results.length} Pokémon imported successfully!`);
    } catch (err) {
        console.error('Global error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedAllPokemon();