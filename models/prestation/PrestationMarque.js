const mongoose = require('mongoose');

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

module.exports = mongoose.model('PrestationMarque', PrestationMarqueSchema);