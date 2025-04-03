const mongoose = require('mongoose');

const MontantServiceClientSchema = new mongoose.Schema({
    idClient: { 
        type: String, 
        required: [true, "Vous devez entrer le client concerné"],
        unique: true
    },
    total: { 
        type: Number,
        required: true,
        min: [0, "La montant ne doit pas être négative"]
    },
    reste: { 
        type: Number,
        required: true,
        min: [0, "La reste ne doit pas être négative"]
    }
}, { timestamps: true });

module.exports = mongoose.model('MontantServiceClient', MontantServiceClientSchema);

