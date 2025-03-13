const mongoose = require('mongoose');
const Marque = require('./Marque');

const ModeleSchema = new mongoose.Schema({
    designationModele: { 
        type: String, 
        required: [true, "La désignation du modèle est obligatoire"] 
    },
    marqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marque",
        required: [true, "La marque du modèle est obligatoire"]
    }
}, { timestamps: true });

ModeleSchema.pre("save", async function (next) {
    const marqueExists = await Marque.findById(this.marqueId);
    if (!marqueExists) {
        return next(new Error("La marque indiquée n'existe pas"));
    }
    next();
});

module.exports = mongoose.model('Modele', ModeleSchema);