const mongoose = require('mongoose');
const Client=require("../Client");

const MontantServiceClientSchema = new mongoose.Schema({
    idClient: { 
        type: String, 
        required: [true, "Vous devez entrer le client concerné"]
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

MontantServiceClientSchema.statics.getMontantServiceByClientId = async function(clientId) {
    const clientExists = await Client.findById(clientId);
        if (!clientExists) {
            return next(new Error("Le client entré n'existe pas"));
        }{};
    return this.find(clientId);
};

module.exports = mongoose.model('MontantServiceClient', MontantServiceClientSchema);

