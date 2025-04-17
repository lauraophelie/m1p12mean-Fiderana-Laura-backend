const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const HistoriqueSalaireBaseSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La date est requise']
    },
    idPoste: {
        type: SchemaTypes.ObjectId,
        ref: 'Poste',
        required: [true, 'Le poste est requis']
    },
    valeur: {
        type: Number,
        required: [true, 'La valeur du salaire de base est requise'],
        min: [0, 'Le salaire de base ne peut pas être négatif']
    }
}, { timestamps: true });

module.exports = mongoose.model('HistoriqueSalaireBase', HistoriqueSalaireBaseSchema);
