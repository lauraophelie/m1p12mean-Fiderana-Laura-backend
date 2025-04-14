const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;
const DetailDiagnostique=require("../diagnostique/DetailDiagnostique");
const Service=require("../service/Service");
const PourcentageAvance=require("../pourcentage/PourcentageAvance");
const ValeurPourPourcentage=require("../pourcentage/valeurPourPourcentage");
const DiagnostiqueSchema = new mongoose.Schema({
    dateDebut: { 
        type: Date, 
        required: [true, "Vous devez entrer la date de début du diagnostique"]
    },
    dateFin: { 
        type: Date,
        required: false
    },
    idRendezVous: { 
        type: SchemaTypes.ObjectId,
        ref: 'RendezVous',
        required: [true, "Vous devez entrer le rendez-vous concerné "]
    },
    total: { 
        type: Number,
        min: [0, "La montant ne doit pas être négative"],
        required: false
    },
    avancePrevus: { 
        type: Number,
        min: [0, "La montant ne doit pas être négative"],
        required: false
    },
    status: { 
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

DiagnostiqueSchema.statics.getDiagnoByStatus = async function(status) {
    const filter = status !== undefined ? { status: Number(status) } : {};
    return this.find(filter);
};

DiagnostiqueSchema.statics.updateDiagnoStatus = async function (diagnoId, newStatus) {
    if (!mongoose.Types.ObjectId.isValid(diagnoId)) {
        throw new Error("ID du diagnostique invalide");
    }
    
    const diagno = await this.findByIdAndUpdate(
        diagnoId, 
        { status: Number(newStatus) }, 
        { new: true } // Retourne le diagno mis à jour
    );

    if (!diagno) {
        throw new Error("Aucun rendez-vous trouvé avec cet ID");
    }

    return diagno;
};


DiagnostiqueSchema.statics.insererDiagnostiqueEtDetails=async function(diagnostiqueData, details) {
    const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const serviceIds = details.map(detail => detail.idService);
        const existingServices = await Service.find({ _id: { $in: serviceIds } }).select('_id');
        const existingIds = existingServices.map(s => s._id.toString());
        const detailsExistants = [];
        const servicesInexistants = [];

        for (const detail of details) {
            if (existingIds.includes(detail.idService.toString())) {
                detailsExistants.push(detail);
            } else {
                servicesInexistants.push(detail);
            }
        }

        if (detailsExistants.length === 0) {
            // await session.abortTransaction();
            session.endSession();
            throw new Error("Vous devez faire entrer des services existants");
        }
        diagnostiqueData.total=await this.calculerSommeTarifs(details);
        diagnostiqueData.avancePrevus=await this.calculerAvancePourDiagnostique(diagnostiqueData.total);
        const [diagnostique] = await this.create([diagnostiqueData], { session });

        const detailsWithDiagno = detailsExistants.map(detail => ({
            ...detail,
            idDiagnostique: diagnostique._id
        }));
        await DetailDiagnostique.insertMany(detailsWithDiagno, { session });

        // await session.commitTransaction();
        // session.endSession();

        return {
            diagnostiqueId: diagnostique._id,
            nbDetailsInsérés: detailsExistants.length,
            servicesInexistants: servicesInexistants
        };

    } catch (error) {
        // await session.abortTransaction();
        // session.endSession();
        throw new Error(error.message);
    }
}

DiagnostiqueSchema.statics.calculerSommeTarifs= function(services) {
    if (!Array.isArray(services)) {
        throw new Error("L'argument doit être un tableau");
    }

    const total = services.reduce((somme, service) => {
        return somme + (service.tarifTotal || 0);
    }, 0);
    return total;
}


DiagnostiqueSchema.statics.calculerAvancePourDiagnostique=async function(total) {
    try {
        const intervalles = await ValeurPourPourcentage.find().sort({ valeurMin: 1 });

        let intervalleCorrespondant = null;
        for (let intervalle of intervalles) {
            const { valeurMin, valeurMax } = intervalle;
            if (
                total >= valeurMin &&
                (valeurMax === undefined || valeurMax === null || total < valeurMax)
            ) {
                intervalleCorrespondant = intervalle;
                break;
            }
        }

        if (!intervalleCorrespondant) {
            throw new Error("Aucun intervalle ne correspond à ce montant.");
        }
        const pourcentageAvance = await PourcentageAvance.findOne({
            idValeurPourPourcentage: intervalleCorrespondant._id
        }).sort({ date: -1 }); // On prend le plus récent si plusieurs

        if (!pourcentageAvance) {
            throw new Error("Aucun pourcentage trouvé pour cet intervalle.");
        }

        // Calcul de l'avance
        const avance = Math.round(total *pourcentageAvance.pourcentage / 100);
        return avance;
    } catch (error) {
        throw new Error("Erreur lors du calcul de l'avance : " + error.message);
    }
}

module.exports = mongoose.model('Diagnostique', DiagnostiqueSchema);

