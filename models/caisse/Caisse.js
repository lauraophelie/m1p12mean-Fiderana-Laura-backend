const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

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
        type: SchemaTypes.ObjectId, 
        ref: 'Monnaie', 
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('Caisse', CaisseSchema);

