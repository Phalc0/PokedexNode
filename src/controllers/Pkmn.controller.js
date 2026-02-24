const PkmnService = require('../services/pkmn.service');
const pkmnService = new PkmnService();

exports.createPkmn = async (req, res) => {
    try {
        let newPkmn = await pkmnService.createPkmn(req.body);
        res.status(201).json(newPkmn);
    }
    catch (err) {
        console.error('Error creating Pokemon:', err); // log pour debug
        res.status(400).json({ message: err.message }); 
    }
}

exports.updatePkmn = async (req, res) => {
    try {
        let updatePkmn = await pkmnService.updatePkmn(req.params.id, req.body);
        res.status(200).json(updatePkmn);
    }
    catch (err) {
        console.error('Error updating Pokemon:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.deletePkmn = async (req, res) => {
    try {
        let deletePkmn = await pkmnService.deletePkmn(req.params.id);
        res.status(200).json({ message: "Pokemon deleted successfully", deletedPkmn: deletePkmn });
    }
    catch (err) {
        console.error('Error deleting Pokemon:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.getPkmnById = async (req, res) => {
    try {
        let Idpkmn = await pkmnService.getPkmnById(req.params.id);
        res.status(200).json(Idpkmn);
    }
    catch (err) {
        console.error('Error fetching Pokemon:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.getAllPkmn = async (req, res) => {
    let allPkmn = await pkmnService.getAllPkmn();
    res.status(200).json(allPkmn);
};

exports.addRegion = async (req, res) => {
    try {
        const { pkmnId, regionName, regionPokedexNumber } = req.body;
        const pokemon = await pkmnService.addRegion(pkmnId, regionName, regionPokedexNumber);
        res.json(pokemon);
    }
    catch (err) {
        res.status(400).json({ message: "Error adding region", error: err });
    }
}

exports.deleteRegion = async (req, res) => {
    try {
        await pkmnService.deleteRegion(req.query.pkmnID, req.query.regionName);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: "Error deleting region", error: err });
    }
};

exports.search = async (req, res) => {
    try {
        const result = await pkmnService.search(req.query);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
