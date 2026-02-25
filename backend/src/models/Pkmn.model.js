// models/pokemon.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const PkmnType = require('./PkmnType.model');

const regionSchema = new mongoose.Schema({
  regionName: { type: String, required: true },
  regionPokedexNumber: { type: Number, required: true },
}, { _id: false }); // prevent creation of _id for sub

const pkmnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  types: [{ type: String, required: true, enum: PkmnType.data }],
  description: { type: String },
  regions: [regionSchema],
  imgUrl: { type: String },
});

const pkmnModel = mongoose.model('Pkmn', pkmnSchema);
module.exports = pkmnModel;