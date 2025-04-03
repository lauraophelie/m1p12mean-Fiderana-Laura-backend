const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const DiagnostiqueSchema = new mongoose.Schema({
    dateDebut: { 
        type: Date, 
        required: [true, "Vous devez entrer la date de début du diagnostique"]
    },
    dateFin: { 
        type: Date,
        required: [true, "Vous devez entrer la date de fin du diagnostique"]
    },
    idRendezVous: { 
        type: SchemaTypes.ObjectId,
        ref: 'RendezVous',
        required: [true, "Vous devez entrer le rendez-vous concerné "]
    },
    total: { 
        type: Number,
        min: [0, "La montant ne doit pas être négative"]
    },
    status: { 
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Diagnostique', DiagnostiqueSchema);

