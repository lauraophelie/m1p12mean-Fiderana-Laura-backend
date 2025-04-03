const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const PourcentageAvanceSchema = new mongoose.Schema({
    valeurMax: { 
        type: Number,
        required: [true, "Vous devez un montant"],
        min: [0, "La montant ne doit pas être négative"]
    },
    valeurMin: { 
        type: Number,
        required: [true, "Vous devez un montant"],
        min: [0, "La montant ne doit pas être négative"]
    },
    pourcentage: { 
        type: Number,
        required: [true, "Vous devez entrer un pourcentage"],
    },
    date: { 
        type: Date,
        ref: 'modePayement',
        required: [true, "Vous devez entrer le client qui effectue un payement"]
    },
    referencePayement: { 
        type: String,
        required: [true, "Vous devez entrer le référence du payement"]
    },
}, { timestamps: true });

module.exports = mongoose.model('PourcentageAvance', PourcentageAvanceSchema);

