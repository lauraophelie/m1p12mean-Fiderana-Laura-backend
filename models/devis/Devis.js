const mongoose = require('mongoose');

const DevisSchema = new mongoose.Schema({
    dateDevis: {
        type: Date,
        required: true,
        default: Date.now
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    voitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voiture",
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Devis', DevisSchema);