const mongoose = require('mongoose');

const MouvementStockSchema = new mongoose.Schema({
    dateStock: {
        type: Date, 
        required: true,
        default: Date.now()
    },
    pieceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece",
        required: true
    },
    prixUnitaire: {
        type: Number,
        required: true,
        min: [0, "Le prix unitaire ne doit pas être négatif"]
    },
    quantiteEntree: {
        type: Number,
        required: false,
        default: 0,
        min: [0, "La quantité ne doit pas être négative"]
    },
    quantiteSortie: {
        type: Number,
        required: false,
        default: 0,
        min: [0, "La quantité ne doit pas être négative"]
    }
}, { timestamps: true });

module.exports = mongoose.model('MouvementStock', MouvementStockSchema);