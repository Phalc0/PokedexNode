const Pkmn = require('../models/Pkmn.model');

class PkmnService {

    async createPkmn(pkmnData) {
        let existingPkmn = await Pkmn.findOne({ name: pkmnData.name });
        if (existingPkmn) {
            throw new Error('A Pokémon with this name already exists');
        }
        let pkmn = new Pkmn(pkmnData);
        return pkmn.save();
    }

    async updatePkmn(pkmnId, pkmnData) {
        return await Pkmn.findByIdAndUpdate(pkmnId, pkmnData, { new: true });
    }

    async deletePkmn(pkmnId) {
        return await Pkmn.findByIdAndDelete(pkmnId);
    }

    async getPkmnById(pkmnId) {
        return await Pkmn.findById(pkmnId);
    }

    async getAllPkmn() {
        return await Pkmn.find();
    }

    async addRegion(pkmnId, regionName, regionNumber) {
        const pokemon = await Pkmn.findById(pkmnId);
        if (!pokemon) throw new Error('Pokemon not found');

        const regionIndex = pokemon.regions.findIndex(r => r.regionName.toLowerCase() === regionName.toLowerCase());
        if (regionIndex >= 0) {
            // update number
            pokemon.regions[regionIndex].regionPokedexNumber = regionNumber;
        } else {
            // add new region
            pokemon.regions.push({ regionName, regionPokedexNumber: regionNumber });
        }

        return pokemon.save();
    }

    async deleteRegion(pkmnId, regionName) {
        const pokemon = await Pkmn.findById(pkmnId);
        if (!pokemon) throw new Error('Pokemon not found');

        pokemon.regions = pokemon.regions.filter(r => r.regionName.toLowerCase() !== regionName.toLowerCase());
        return pokemon.save();
    }

    async search({ page = 1, size = 10, typeOne, typeTwo, partialName }) {
        const query = {};
        if (typeOne) query.types = typeOne;
        if (typeTwo) query.types = { $all: [typeOne, typeTwo] };
        if (partialName) query.name = { $regex: partialName, $options: 'i' };

        const count = await Pkmn.countDocuments(query);
        const data = await Pkmn.find(query)
            .skip((page - 1) * size)
            .limit(size);

        return { count, data };
    }
}

module.exports = PkmnService;