const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const DetailDiagnostiqueSchema = new mongoose.Schema({
    idDiagnostique: { 
        type: SchemaTypes.ObjectId,
        ref: 'Diagnostique',
        required: [true, "Vous devez entrer le diagnostique "]
    },
    idService: { 
        type: SchemaTypes.ObjectId,
        ref: 'Service',
        required: [true, "Vous devez entrer le service "]
    },
    montant: { 
        type: Number,
        min: [0, "La montant ne doit pas être négative"]
    },
    status: { 
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('DetailDiagnostique', DetailDiagnostiqueSchema);

