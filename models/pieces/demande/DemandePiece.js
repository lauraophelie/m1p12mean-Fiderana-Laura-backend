const mongoose = require('mongoose');

const DemandePieceSchema = new mongoose.Schema({
    dateDemande: {
        type: Date,
        required: false,
        default: Date.now()
    },
    motifDemande: {
        type: String,
        required: [true, "Le motif de la demande de pièce est obligatoire"]
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

module.exports = mongoose.model('DemandePiece', DemandePieceSchema);