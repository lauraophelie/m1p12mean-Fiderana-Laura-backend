const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const ValeurPourPourcentageSchema = new mongoose.Schema({
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
    date: { 
        type: Date,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('ValeurPourPourcentage', ValeurPourPourcentageSchema);

