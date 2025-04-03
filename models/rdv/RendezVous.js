const mongoose = require('mongoose');

const Client = require('../Client');
const Voiture = require('../voiture/Voiture');
const Employe=require('../Employe');
const RendezVousSchema = new mongoose.Schema({
    dateRdv: {
        type: Date,
        required: [true, "La date de rendez-vous est obligatoire"]
    },
    heureRdv: {
        type: String,
        required: [true, "L'heure de rendez-vous est obligatoire"]
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    voitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voiture",
        required: [true, "La voiture doit être indiquée"]
    },
    commentaire: {
        type: String,
        required: false
    },
    mecanicienId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

RendezVousSchema.pre("save", async function (next) {
    const clientExists = await Client.findById(this.clientId);
    if(!clientExists) {
        return next(new Error("Le client n'existe pas"));
    }
    const voitureExists = await Voiture.findById(this.voitureId);
    if(!voitureExists) {
        return next(new Error("La voiture indiquée n'existe pas"));
    }
    next();
});

RendezVousSchema.statics.getRdvByStatus = async function(status) {
    const filter = status !== undefined ? { status: Number(status) } : {};
    return this.find(filter);
};

RendezVousSchema.statics.updateRdvStatus = async function (rdvId, newStatus) {
    if (!mongoose.Types.ObjectId.isValid(rdvId)) {
        throw new Error("ID du rendez-vous invalide");
    }
    
    const rdv = await this.findByIdAndUpdate(
        rdvId, 
        { status: Number(newStatus) }, 
        { new: true } // Retourne le RDV mis à jour
    );

    if (!rdv) {
        throw new Error("Aucun rendez-vous trouvé avec cet ID");
    }

    return rdv;
};

RendezVousSchema.statics.updateRdvMeca = async function (rdvId, mecanicienId) {
    if (!mongoose.Types.ObjectId.isValid(rdvId) || !mongoose.Types.ObjectId.isValid(mecanicienId)) {
        throw new Error("ID du rendez-vous ou du mécanicien invalide");
    }

    // Vérifier si le mécanicien existe et récupérer son poste
    const mecanicien = await Employe.findById(mecanicienId).populate("poste");

    if (!mecanicien) {
        throw new Error("Aucun mécanicien trouvé avec cet ID");
    }

    // Vérifier si son poste est bien "mécanicien" (sans tenir compte de la casse)
    if (!mecanicien.poste || !mecanicien.poste.nomPoste || mecanicien.poste.nomPoste.toLowerCase() !== "mécanicien") {
        throw new Error("L'employé n'a pas le poste de mécanicien");
    }
    const rdv = await this.findByIdAndUpdate(
        rdvId, 
        { mecanicienId: (mecanicienId) }, 
        { new: true } // Retourne le RDV mis à jour
    );

    if (!rdv) {
        throw new Error("Aucun rendez-vous trouvé avec cet ID");
    }

    return rdv;
};

module.exports = mongoose.model('RendezVous', RendezVousSchema);