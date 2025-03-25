const mongoose = require('mongoose');

const ServicesRendezVousSchema = new mongoose.Schema({
    rendezVousId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RendezVous",
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ServicesRendezVous', ServicesRendezVousSchema);