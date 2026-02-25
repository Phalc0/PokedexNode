const trainerModel = require('../models/Trainer.model');
const userModel = require('../models/User.model');
const pkmnModel = require('../models/Pkmn.model');

const mongoose = require('mongoose');

class TrainerService {
    async createTrainer(userId, data) {
        // Ensure the user exists before creating a trainer profile
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found')
        }
        // Check if the user already has a trainer profile
        const existingTrainer = await trainerModel.findOne({ username: user.username });
        if (existingTrainer) {
            throw new Error('A trainer profile already exists for this user');
        }

        // Create the trainer profile
        const trainer = await trainerModel.create({
            username: user.username,
            trainerName: data.trainerName,
            imgUrl: data.imgUrl,
            pkmnSeen: [],
            pkmnCaught: []
        });

        return trainer;
    }

    async updateTrainer(userId, data) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found')
        }
        const trainer = await trainerModel.findOneAndUpdate({ username: user.username }, data, { new: true });
        if (!trainer) {
            throw new Error('Trainer not found');
        }

        return trainer;
    }

    async deleteTrainer(userId) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const trainer = await trainerModel.findOneAndDelete({ username: user.username });
        if (!trainer) {
            throw new Error('Trainer not found');
        }
        return trainer;
    }

    async getTrainerById(userId) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const trainer = await trainerModel.findOne({ username: user.username });
        if (!trainer) {
            throw new Error('Trainer not found');
        }
        return trainer;
    }


    async markPkmn(userId, pkmnId, isCaught) {
        // Validate pkmnId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(pkmnId)) {
            throw new Error('Invalid Pokemon ID');
        }

        // Check if the User exists
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if the Trainer exists
        const trainer = await trainerModel.findOne({ username: user.username });
        if (!trainer) {
            throw new Error('Trainer not found');
        }

        // Check if the Pokemon exists
        const pkmn = await pkmnModel.findById(pkmnId);
        if (!pkmn) {
            throw new Error('Pokemon not found');
        }
        // Add to seen if not already there
        if (!trainer.pkmnSeen.includes(pkmnId)) {
            trainer.pkmnSeen.push(pkmnId);
        }

        // add to caught
        if (isCaught) {
            if (!trainer.pkmnCaught.includes(pkmnId)) {
                trainer.pkmnCaught.push(pkmnId);
            }
        }
        
        await trainer.save();
        
        return trainer;
    }
}

module.exports = TrainerService;