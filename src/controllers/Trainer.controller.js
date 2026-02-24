//* Note: All methods now use req.auth.userId instead of req.params.id for better security
//* This ensures users can only access their own trainer data


const TrainerService = require('../services/trainer.service');
const trainerService = new TrainerService();

exports.createTrainer = async (req, res) => {
    try {
        let newTrainer = await trainerService.createTrainer(req.auth.userId, req.body);
        res.status(201).json(newTrainer);
    }
    catch (err) {
        console.error('Error creating Trainer:', err);
        res.status(400).json({ message: err.message }); 
    }
}

exports.updateTrainer = async (req, res) => {
    try {
        let updateTrainer = await trainerService.updateTrainer(req.auth.userId, req.body);
        res.status(200).json(updateTrainer);
    }
    catch (err) {
        console.error('Error updating Trainer:', err);
        res.status(400).json({ message: err.message });
    }
}

exports.deleteTrainer = async (req, res) => {
    try {
        let deleteTrainer = await trainerService.deleteTrainer(req.auth.userId);
        res.status(200).json({ message: "Trainer deleted successfully", deletedTrainer: deleteTrainer });
    }
    catch (err) {
        console.error('Error deleting Trainer:', err);
        res.status(400).json({ message: err.message });
    }
}

exports.getTrainerById = async (req, res) => {
    try {
        let IdTrainer = await trainerService.getTrainerById(req.auth.userId);
        res.status(200).json(IdTrainer);
    }
    catch (err) {
        console.error('Error fetching Trainer:', err);
        res.status(400).json({ message: err.message });
    }
}

exports.markPkmn = async (req, res) => {
    try {
        const { pkmnId, isCatched } = req.body;
        const trainer = await trainerService.markPkmn(req.auth.userId, pkmnId, isCatched);
        res.status(200).json(trainer);
    }
    catch (err) {
        console.error('Error marking Pokémon:', err);
        res.status(400).json({ message: err.message });
    }
}