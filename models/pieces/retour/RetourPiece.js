const mongoose = require('mongoose');

const RetourPieceSchema = new mongoose.Schema({
    dateRetour: {
        type: Date,
        required: true,
        default: Date.now
    },
    pieceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece",
        required: true
    },
    quantiteRetour: {
        type: Number,
        required: [true, "Veuillez indiquer la quantité de pièce que vous retournez"],
        min: [0, "La quantité ne doit pas être négative"]
    },
    motifRetour: {
        type: String,
        required: [true, "Veuillez indiquer le motif du retour"]
    },
    mecanicienId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('RetourPiece', RetourPieceSchema);