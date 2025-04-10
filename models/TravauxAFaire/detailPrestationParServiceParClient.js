const mongoose = require('mongoose');

const DetailPrestationParServiceParClientSchema = new mongoose.Schema({
    idPrestationParServiceParClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrestationParServiceValideParClient",
        required: [true, "L'ID de la prestation validée est obligatoire"]
    },
    idMecanicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: [true, "L'ID du mécanicien est obligatoire"]
    },
    commentaire: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('DetailPrestationParServiceParClient', DetailPrestationParServiceParClientSchema);
