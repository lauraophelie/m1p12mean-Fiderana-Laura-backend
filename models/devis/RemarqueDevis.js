const mongoose = require('mongoose');

const RemarqueDevisSchema = new mongoose.Schema({
    dateReponse: {
        type: Date,
        required: true,
        default: Date.now
    },
    remarqueDevis: {
        type: String,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: true
    },
    devisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnostique",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('RemarqueDevis', RemarqueDevisSchema);