const mongoose = require('mongoose');

const BoiteVitesseSchema = new mongoose.Schema({
    designationBoite: {
        type: String,
        required: [true, "La désignation est obligatoire"],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BoiteVitesse', BoiteVitesseSchema);