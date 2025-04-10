const mongoose = require('mongoose');
const CategoriePiece = require('./CategoriePiece');

const PieceSchema = new mongoose.Schema({
    nomPiece: {
        type: String,
        required: [true, "Le nom de la pièce est obligatoire"]
    },
    categoriePieceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoriePiece",
        required: [true, "Le catégorie de la pièce est obligatoire"]
    },
    reference: {
        type: String,
        required: [true, "La référence de la pièce est obligatoire"]
    },
    seuilAlerte: {
        type: Number,
        required: [true, "Veuillez indiquer le seuil d'alerte"],
        min: [0, "Le seuil d'alerte ne doit pas être négatif"]
    },
    prixUnitaire: {
        type: Number,
        required: [true, "Veuillez indiquer le prix unitaire"],
        min: [0, "Le prix unitaire ne doit pas être négatif"]
    }
}, { timestamps: true });

PieceSchema.pre("save", async function (next) {
    const categorieExists = await CategoriePiece.findById(this.categoriePieceId);
    if(!categorieExists) {
        return next(new Error("La catégorie indiquée n'existe pas"));
    }
    next();
});

module.exports = mongoose.model('Piece', PieceSchema);