const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;
const Client=require("../Client");
const TransactionCaisse = require('../caisse/TransactionCaisse');
const MontantServiceClient = require('../clientService/montantServiceClient');
const Caisse = require('../caisse/Caisse');


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
        ref: 'ModePayement',
        required: [true, "Vous devez entrer le client qui effectue un payement"]
    },
    referencePayement: { 
        type: String,
        required: [true, "Vous devez entrer le référence du payement"]
    },
}, { timestamps: true });


PayementClientSchema.statics.getResteDuClient = async function(clientId) {
    try {
        const montantServiceClient = await MontantServiceClient.findOne({ idClient: clientId });

        if (!montantServiceClient) {
            throw new Error("Le client n'a pas de service associé.");
        }

        return {
            clientId: montantServiceClient.idClient,
            reste: montantServiceClient.reste
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

PayementClientSchema.statics.getMontantServiceByClientId = async function(clientId) {
    const clientExists = await Client.findById(clientId);
        if (!clientExists) {
            return next(new Error("Le client entré n'existe pas"));
        }{};
    return this.find(clientId);
};

// PayementClientSchema.statics.createWithTransaction = async function(payementClientData, idEmploye) {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         // Étape 1 : Créer le PayementClient
//         const payementClient = new this(payementClientData);
//         await payementClient.save({ session });

//         // Étape 2 : Chercher la caisse principale (insensible à la casse)
//         const caissePrincipale = await Caisse.findOne({
//             nomCaisse: { $regex: new RegExp("^caisse principale$", "i") }
//         }).session(session);

//         if (!caissePrincipale) {
//             throw new Error("Caisse principale introuvable");
//         }

//         // Étape 3 : Créer la transactionCaisse
//         const newTransaction = new TransactionCaisse({
//             idCaisse: caissePrincipale._id,
//             typeOperation: 1,
//             montant: payementClient.montant,
//             motif: "payement d'un client",
//             dateOperation: payementClient.datePayement,
//             employeResponsable: idEmploye
//         });
//         await newTransaction.save({ session });

//         // Étape 4 : Mettre à jour le soldeActuel de la caisse principale
//         caissePrincipale.soldeActuel += payementClient.montant;
//         await caissePrincipale.save({ session });

//         // Étape 5 : Mettre à jour le "reste" du MontantServiceClient
//         const montantService = await MontantServiceClient.findOne({ idClient: payementClient.idClient }).session(session);

//         if (!montantService) {
//             throw new Error("MontantServiceClient introuvable pour ce client");
//         }

//         montantService.reste -= payementClient.montant;
//         await montantService.save({ session });

//         // Commit
//         await session.commitTransaction();
//         session.endSession();

//         return { payementClient, transaction: newTransaction, caissePrincipale, montantService };

//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         throw error;
//     }
// };

PayementClientSchema.statics.insertionPayementClient = async function(payementClientData, idEmploye) {
    try {
        // Étape 1 : Créer le PayementClient
        const payementClient = new this(payementClientData);
        await payementClient.save();

        // Étape 2 : Chercher la caisse principale (insensible à la casse)
        const caissePrincipale = await Caisse.findOne({
            nomCaisse: { $regex: new RegExp("^caisse principale$", "i") }
        });

        if (!caissePrincipale) {
            throw new Error("Caisse principale introuvable");
        }

        // Étape 3 : Créer la transactionCaisse
        const newTransaction = new TransactionCaisse({
            idCaisse: caissePrincipale._id,
            typeOperation: 1,
            montant: payementClient.montant,
            motif: "payement d'un client",
            dateOperation: payementClient.datePayement,
            employeResponsable: idEmploye
        });
        await newTransaction.save();

        // Étape 4 : Mettre à jour le soldeActuel de la caisse principale
        caissePrincipale.soldeActuel += payementClient.montant;
        await caissePrincipale.save();

        // Étape 5 : Mettre à jour le "reste" du MontantServiceClient
        const montantService = await MontantServiceClient.findOne({ idClient: payementClient.idClient });

        if (!montantService) {
            throw new Error("MontantServiceClient introuvable pour ce client");
        }

        montantService.reste -= payementClient.montant;
        await montantService.save();

        return { payementClient, transaction: newTransaction, caissePrincipale, montantService };

    } catch (error) {
        throw error;
    }
};


module.exports = mongoose.model('PayementClient', PayementClientSchema);

