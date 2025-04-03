const mongoose = require('mongoose');

const DemandePieceSchema = new mongoose.Schema({
    dateDemande: {
        type: Date,
        required: true,
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

DemandePieceSchema.methods.validateDemande = async function(status = 10) {
    try {
        return await this.updateOne(
            { _id: this._id }, { $set: { status: status }}
        );
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model('DemandePiece', DemandePieceSchema);