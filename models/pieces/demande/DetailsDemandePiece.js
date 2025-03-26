const mongoose = require('mongoose');

const DetailsDemandePieceSchema = new mongoose.Schema({
    demandeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DemandePiece",
        required: true
    },
    pieceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece",
        required: true
    },
    quantite: {
        type: Number,
        required: [true, "Veuillez indiquer la quantité de pièce"],
        min: [0, "La quantité ne doit pas être négative"]
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

DetailsDemandePieceSchema.methods.validateDetails = async function(status = 10) {
    try {
        return await this.updateOne(
            { demandeId: this.demandeId }, { $set: { status: status }}
        );
    } catch(error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model('DetailsDemandePiece', DetailsDemandePieceSchema);