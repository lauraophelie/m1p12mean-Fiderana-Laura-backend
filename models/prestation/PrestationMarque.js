const mongoose = require('mongoose');

const Prestation = require('../prestation/Prestation');
const Marque = require('../marque/Marque');

const PrestationMarqueSchema = new mongoose.Schema({
    prestationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prestation",
        required: [true, "Veuillez préciser la prestation concernée"]
    },
    marqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marque",
        required: [true, "Veuillez préciser la marque concernée"]
    },
    tarif: {
        type: Number,
        required: [true, "Veuillez préciser le tarif"],
        min: [0, "Le tarif ne peut pas être négatif"]
    },
    dureeEstimee: {
        type: Number,
        required: [true, "Veuillez préciser la durée estimée"],
        min: [0, "La durée estimée ne doit pas être négative"]
    }
}, { timestamps: true });

PrestationMarqueSchema.pre("save", async function (next) {
    const prestationExists = await Prestation.findById(this.prestationId);
    if(!prestationExists) {
        return next(new Error("Le prestation indiquée n'existe pas"));
    }

    const marqueExists = await Marque.findById(this.marqueId);
    if (!marqueExists) {
        return next(new Error("La marque de voiture indiquée n'existe pas"));
    }
    next(); 
});

module.exports = mongoose.model('PrestationMarque', PrestationMarqueSchema);