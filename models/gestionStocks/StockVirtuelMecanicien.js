const mongoose = require('mongoose');

const StockVirtuelMecanicienSchema = new mongoose.Schema({
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
    },
    mecanicienId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('StockVirtuelMecanicien', StockVirtuelMecanicienSchema);