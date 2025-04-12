const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;
const DetailDiagnostique=require("../diagnostique/DetailDiagnostique");
const Service=require("../service/Service");
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
        return somme + (service.tarif || 0);
    }, 0);
    return total;
}




module.exports = mongoose.model('Diagnostique', DiagnostiqueSchema);

