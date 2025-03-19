const mongoose = require('mongoose');

const HistoriquePrestationMarque = new mongoose.Schema({
    prestationMarqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrestationMarque"
    },
    ancienTarif: {
        type: Number,
        required: true,
        min: 0
    },
    ancienneDureeEstimee: {
        type: Number,
        required: true,
        min: 0
    }    
}, { timestamps: true });

module.exports = mongoose.model('HistoriquePrestationMarque', HistoriquePrestationMarque);