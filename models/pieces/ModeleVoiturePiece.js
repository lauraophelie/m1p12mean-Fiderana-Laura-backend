const mongoose = require('mongoose');

const ModeleVoiturePieceSchema = new mongoose.Schema({
    pieceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece",
        required: true
    },
    modeleVoitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modele",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ModeleVoiturePiece', ModeleVoiturePieceSchema);