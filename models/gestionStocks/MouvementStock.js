const mongoose = require('mongoose');
const Piece = require('../pieces/Piece');

const MouvementStockSchema = new mongoose.Schema({
    dateStock: {
        type: Date, 
        required: true,
        default: Date.now
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

// MouvementStockSchema.methods.sortieStock = async function(data) {
//     try {
//         const pieceFind = await Piece.findById(data.pieceId);

//         this.dateStock = data.dateStock ? new Date(data.dateStock) : Date.now();
//         this.pieceId = data.pieceId;
//         this.prixUnitaire = pieceFind.prixUnitaire;
//         this.quantiteSortie = data.quantiteSortie;

//         return await this.save();
//     } catch (error) {
//         throw new Error(error);
//     }
// }

module.exports = mongoose.model('MouvementStock', MouvementStockSchema);