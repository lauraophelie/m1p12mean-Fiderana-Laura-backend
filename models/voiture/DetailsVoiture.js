const mongoose = require('mongoose');

const DetailsVoitureSchema = new mongoose.Schema({
    voitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voiture",
        required: true
    },
    remarques: {
        type: String,
        required: false
    },
    images: {
        type: [String],
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('DetailsVoiture', DetailsVoitureSchema);