const mongoose = require('mongoose');

const Marque = require('../marque/Marque');
const Modele = require('../marque/Modele');
const CategorieVoiture = require('./CategorieVoiture');
const TypeEnergie = require('./TypeEnergie');
const BoiteVitesse = require('./BoiteVitesse');
const Client = require('../Client');

const VoitureSchema = new mongoose.Schema({
    immatriculation: {
        type: String,
        required: [true, "Le numéro d'immatriculation est obligatoire"],
        unique: true
    },
    marqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marque",
        required: [true, "La marque de la voiture est obligatoire"]
    },
    modeleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modele",
        required: [true, "Le modèle de la voiture doit être indiqué"]
    },
    categorieVoitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategorieVoiture",
        required: [true, "La catégorie de la voiture doit être indiquée"]
    },
    typeEnergieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeEnergie",
        required: [true, "Le type énergie doit être indiqué"]
    },
    boiteVitesseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoiteVitesse",
        required: [true, "Le type de boite de vitesse doit être indiqué"]
    },
    anneeFabrication: {
        type: Number,
        required: false
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    }
}, { timestamps: true });

VoitureSchema.pre("save", async function (next) {
    const clientExists = await Client.findById(this.clientId);
    if(!clientExists) {
        return next(new Error("Le client n'existe pas"));
    }
    const marqueExists = await Marque.findById(this.marqueId);
    if (!marqueExists) {
        return next(new Error("La marque indiquée n'existe pas"));
    }
    const modeleExists = await Modele.findById(this.modeleId);
    if (!modeleExists) {
        return next(new Error("La modèle indiqué n'existe pas"));
    }
    const categorieExists = await CategorieVoiture.findById(this.categorieVoitureId);
    if(!categorieExists) {
        return next(new Error("La catégorie indiquée n'existe pas"));
    }
    const typeEnergieExits = await TypeEnergie.findById(this.typeEnergieId);
    if(!typeEnergieExits) {
        return next(new Error("La type d'énergie indiqué n'existe pas"));
    }
    const boiteVitesseExists = await BoiteVitesse.findById(this.boiteVitesseId);
    if(!boiteVitesseExists) {
        return next(new Error("La boite de vitesse indiquée n'existe pas"));
    }
    next();
});
module.exports = mongoose.model('Voiture', VoitureSchema);