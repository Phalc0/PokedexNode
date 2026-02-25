const mongoose = require('mongoose');
const { Schema } = mongoose;

const trainerSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    imgUrl:{
        type: String,
        required: true
    },
    trainerName:{
        type: String,
        required: true
    },
    creationDate:{
        type: Date,
        default: Date.now
    },
    pkmnSeen:[{
        type: Schema.Types.ObjectId, // Type ObjectId to reference the Pkmn model
        ref: 'Pkmn'
    }],
    pkmnCaught:[{
        type: Schema.Types.ObjectId, // Type ObjectId to reference the Pkmn model
        ref: 'Pkmn'
    }]
})

module.exports = mongoose.model('Trainer', trainerSchema);