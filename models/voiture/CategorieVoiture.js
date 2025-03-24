const mongoose = require('mongoose');

const CategorieVoitureSchema = new mongoose.Schema({
    designationCategorie: {
        type: String,
        required: [true, "La désignation de la catégorie est obligatoire"],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CategorieVoiture', CategorieVoitureSchema);