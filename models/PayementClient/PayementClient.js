const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const PayementClientSchema = new mongoose.Schema({
    idClient: { 
        type: SchemaTypes.ObjectId,
        ref: 'Client', 
        required: [true, "Vous devez entrer le client qui effectue un payement"]
    },
    montant: { 
        type: Number,
        required: [true, "Vous devez un montant"],
        min: [0, "La montant ne doit pas être négative"]
    },
    datePayement: { 
        type: Date,
        required: [true, "Vous devez entrer le client qui effectue un payement"],
    },
    modePayement: { 
        type: SchemaTypes.ObjectId,
        ref: 'modePayement',
        required: [true, "Vous devez entrer le client qui effectue un payement"]
    },
    referencePayement: { 
        type: String,
        required: [true, "Vous devez entrer le référence du payement"]
    },
}, { timestamps: true });

module.exports = mongoose.model('PayementClient', PayementClientSchema);

