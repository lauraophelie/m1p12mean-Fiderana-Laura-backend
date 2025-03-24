const mongoose = require('mongoose');

const CategoriePieceSchema = new mongoose.Schema({
    designationCategoriePiece: {
        type: String, 
        required: [true, "La désignation de la catégorie est obligatoire"]
    }
}, { timestamps: true });

module.exports = mongoose.model('CategoriePiece', CategoriePieceSchema);