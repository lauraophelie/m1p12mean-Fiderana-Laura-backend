const mongoose = require('mongoose');

const CaisseSchema = new mongoose.Schema({
    nomCaisse: { 
        type: String, 
        required: [true, "Le nom de la caisse est obligatoire"],
        unique: true
    },
    soldeInitial: { 
        type: Number
    },
    soldeActuel: { 
        type: Number
    },
    monnaie: { 
        type: String 
    },
}, { timestamps: true });

module.exports = mongoose.model('Caisse', CaisseSchema);

