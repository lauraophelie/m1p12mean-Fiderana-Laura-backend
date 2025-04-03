const mongoose = require('mongoose');

const Client = require('../Client');
const Voiture = require('../voiture/Voiture');

const RendezVousSchema = new mongoose.Schema({
    dateRdv: {
        type: Date,
        required: [true, "La date de rendez-vous est obligatoire"]
    },
    heureRdv: {
        type: String,
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
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

RendezVousSchema.pre("save", async function (next) {
    const clientExists = await Client.findById(this.clientId);
    if(!clientExists) {
        return next(new Error("Le client n'existe pas"));
    }
    const voitureExists = await Voiture.findById(this.voitureId);
    if(!voitureExists) {
        return next(new Error("La voiture indiquée n'existe pas"));
    }
    next();
});

module.exports = mongoose.model('RendezVous', RendezVousSchema);