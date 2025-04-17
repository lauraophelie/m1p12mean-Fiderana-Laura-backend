const mongoose = require('mongoose');
const PrestationMarque = require('../prestation/PrestationMarque');
const Employe = require('../Employe/Employe');
const Diagnostique = require('../diagnostique/Diagnostique');

const PrestationParServiceValideParClientSchema = new mongoose.Schema({
    idPrestationMarque: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrestationMarque",
        required: [true, "Veuillez spécifier la prestation concernée"]
    },
    idMecanicienEnChef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: false
    },
    idDiagno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnostique",
        required: [true, "Veuillez spécifier le diagnostic associé"]

    },
    dateDebut: {
        type: Date,
        required: false
    },
    dateFin: {
        type: Date,
        required: false
    },
    heureDebut: {
        type: String,
        required: false
    },
    heureFin: {
        type: String,
        required: false
    },
    pourcentage: {
        type: Number,
        required: false,
        default:0
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });


PrestationParServiceValideParClientSchema.statics.insererPrestationParServiceValideParClient = async function (prestationMarques, idDiagnostique) {
    if (!mongoose.Types.ObjectId.isValid(idDiagnostique)) {
        throw new Error("ID diagnostique invalide");
    }

    if (!Array.isArray(prestationMarques) || prestationMarques.length === 0) {
        throw new Error("Le tableau de prestations est vide ou invalide");
    }

    const prestationsToInsert = prestationMarques.map(pm => ({
        idPrestationMarque: pm._id || pm.idPrestationMarque,
        idDiagno: idDiagnostique,
        status: 0,
        pourcentage: 0
        // autres champs laissés par défaut
    }));

    const insertedDocs = await this.insertMany(prestationsToInsert);
    return insertedDocs;
}
module.exports = mongoose.model('PrestationParServiceValideParClient', PrestationParServiceValideParClientSchema);
