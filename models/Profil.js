const mongoose = require('mongoose');

const ProfilSchema = new mongoose.Schema({
 nomProfil: { type: String, required: true },
 description: { type: String, required: false },
 appellation: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Profil', ProfilSchema);