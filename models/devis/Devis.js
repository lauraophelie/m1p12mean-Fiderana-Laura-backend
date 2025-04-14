const DetailDiagnostique = require("../diagnostique/DetailDiagnostique");
const Diagnostique = require("../diagnostique/Diagnostique");
const Prestation = require("../prestation/Prestation");
const PrestationMarque = require("../prestation/PrestationMarque");
const RendezVous = require("../rdv/RendezVous");
const ServicesRendezVous = require("../rdv/ServicesRendezVous");

const getDetailsDevisRdv = async (rdvId) => {
    try {
        const rendezVousFind = await RendezVous.findById(rdvId)
            .populate({ path: "voitureId", select: "modeleId" });

        if(!rendezVousFind) {
            throw new Error("Le rendez-vous indiqué n'existe pas");
        }
        const { modeleId } = rendezVousFind.voitureId;
        const servicesRendezVous = await ServicesRendezVous.find({ rdvId })
            .populate({ path: "serviceId", select: "nomService" });
        const details = [];

        for(const service of servicesRendezVous) {
            const { _id, nomService } = service.serviceId;
            const prestationService = await Prestation.find({ serviceId: _id });

            let somme = 0;
            for(const prestation of prestationService) {
                const { _id } = prestation;
                const prestationMarque = await PrestationMarque.findOne({ prestationId: _id, modeleId: modeleId });

                somme += prestationMarque.tarif;
            }
            details.push({
                idService: _id,
                service: nomService,
                total: somme
            });
        }
        return details;
    } catch (error) {
        throw error;
    }
};

const getDetailsDevis = async (id) => {
    try {
        const diagnostiqueFind = await Diagnostique.findById(id)
            .populate({ 
                path: "idRendezVous", 
                select: "dateRdv heureRdv clientId voitureId",
                populate: [
                    { path: "clientId", select: "nomClient prenom"}
                ]
            });
        if(!diagnostiqueFind) {
            throw new Error("Le devis indiqué n'existe pas");
        }
        const detailsDiagnostique = await DetailDiagnostique.find({ id })
            .populate({ path: "idService", select: "nomService" });

        const { idRendezVous } = diagnostiqueFind;
        const detailsServicesRdv = await getDetailsDevisRdv(idRendezVous);

        return {
            diagnostique: diagnostiqueFind,
            detailsServiceRdv: detailsServicesRdv,
            detailsDiagnostique: detailsDiagnostique
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getDetailsDevisRdv,
    getDetailsDevis
};

/*const mongoose = require('mongoose');

const DevisSchema = new mongoose.Schema({
    dateDevis: {
        type: Date,
        required: true,
        default: Date.now
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    voitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voiture",
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Devis', DevisSchema);*/