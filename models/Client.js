const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
 nomClient: { type: String, required: true },
 prenom: { type: String, required: true },
 adresse: { type: String, required: true },
 phone: { type: String, required: true },
 sexe: { type: Number, required: true },
 dateCreationCompte: { type: Date, required: true },
 mail: { type: String, required: true },
 mdp: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Client', ClientSchema);