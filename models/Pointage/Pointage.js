// models/pointage/Pointage.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PointageSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La date est requise']
    },
    idEmploye: {
        type: Schema.Types.ObjectId,
        ref: 'Employe',
        required: [true, 'L\'employé est requis']
    },
    heureArrivee: {
        type: String,
        required: [true, 'Heure d\'arrivée requise']
    },
    heureSortie: {
        type: String,
        required: [true, 'Heure de sortie requise']
    }
}, { timestamps: true });

module.exports = mongoose.model('Pointage', PointageSchema);
