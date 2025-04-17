const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const FicheDePaieSchema = new Schema({
    idEmploye: {
        type: SchemaTypes.ObjectId,
        ref: 'Employe',
        required: [true, 'L\'employé est requis']
    },
    dateDebut: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    dateFin: {
        type: Date,
        required: [true, 'La date de fin est requise']
    },
    salaireBase: {
        type: Number,
        required: true,
        min: [0, 'Le salaire de base ne peut pas être négatif']
    },
    TVA: {
        type: Number,
        required: true,
        min: [0, 'La TVA ne peut pas être négative']
    },
    salaireBrut: {
        type: Number,
        required: true,
        min: [0, 'Le salaire brut ne peut pas être négatif']
    },
    HeureSup: {
        type: Number,
        required: false,
        min: [0, 'Les heures supplémentaires ne peuvent pas être négatives'],
        default: 0
    },
    CongeAPaye: {
        type: Number,
        required: false,
        min: [0, 'Le congé à payer ne peut pas être négatif'],
        default: 0
    },
    CongeAEnleve: {
        type: Number,
        required: false,
        min: [0, 'Le congé à enlever ne peut pas être négatif'],
        default: 0
    },
    SecuriteSociale: {
        type: Number,
        required: false,
        min: [0, 'La sécurité sociale ne peut pas être négative'],
        default: 0
    },
    Sante: {
        type: Number,
        required: false,
        min: [0, 'La cotisation santé ne peut pas être négative'],
        default: 0
    },
    SalaireNet: {
        type: Number,
        required: true,
        min: [0, 'Le salaire net ne peut pas être négatif']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FicheDePaie', FicheDePaieSchema);
