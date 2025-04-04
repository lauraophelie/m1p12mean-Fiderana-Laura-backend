const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const DiagnostiqueSchema = new mongoose.Schema({
    dateDebut: { 
        type: Date, 
        required: [true, "Vous devez entrer la date de début du diagnostique"]
    },
    dateFin: { 
        type: Date,
        required: [true, "Vous devez entrer la date de fin du diagnostique"]
    },
    idRendezVous: { 
        type: SchemaTypes.ObjectId,
        ref: 'RendezVous',
        required: [true, "Vous devez entrer le rendez-vous concerné "]
    },
    total: { 
        type: Number,
        min: [0, "La montant ne doit pas être négative"]
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

module.exports = mongoose.model('Diagnostique', DiagnostiqueSchema);

