const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    dateRdv: {
        type: Date,
        required: [true, "La date de rendez-vous est obligatoire"]
    },
    heureRdv: {
        type: TimeRanges,
        required: [true, "L'heure de rendez-vous est obligatoire"]
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    voitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voiture",
        required: [true, "La voiture doit être indiquée"]
    },
    commentaire: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('RendezVous', RendezVousSchema);