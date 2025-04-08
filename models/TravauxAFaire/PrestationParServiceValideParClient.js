const mongoose = require('mongoose');
const PrestationMarque = require('../prestationMarque/PrestationMarque');
const Employe = require('../Employe');
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
        required: [true, "Veuillez spécifier le mécanicien en chef"]
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

PrestationParServiceValideParClientSchema.statics.insertionMultiplePrestationParServiceValideParClient = async function(idDiagnostique) {
    // Vérifier si l'idDiagnostique est valide
    if (!mongoose.Types.ObjectId.isValid(idDiagnostique)) {
        throw new Error("ID diagnostique invalide");
    }

 
    const prestationMarques = await PrestationMarque.getPrestationsByServiceForClient(idDiagnostique);

    const prestationsToInsert = prestationMarques.map(prestationMarque => ({
        idPrestationMarque: prestationMarque.idPrestationMarque,
        idDiagno: idDiagnostique, 
        status: 0, 
    }));

    // Insérer tous les documents en une seule fois
    await this.insertMany(prestationsToInsert);
    return prestationMarques; // Retourner les résultats obtenus
};

module.exports = mongoose.model('PrestationParServiceValideParClient', PrestationParServiceValideParClientSchema);
