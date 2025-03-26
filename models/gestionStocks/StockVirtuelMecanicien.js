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

StockVirtuelMecanicienSchema.methods.entreeStock = async function(data, mecanicienId) {
    try {
        this.dateStock = data.dateStock ? new Date(data.dateStock) : Date.now();
        this.pieceId = data.pieceId;
        this.quantiteEntree = data.quantite;
        this.mecanicienId = mecanicienId;

        return await this.save();
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model('StockVirtuelMecanicien', StockVirtuelMecanicienSchema);