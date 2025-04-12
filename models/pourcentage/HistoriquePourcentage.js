const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const HistoriquePourcentageAvanceSchema = new mongoose.Schema({
   idValeurPourPourcentage:{
    type: SchemaTypes.ObjectId,
        ref: 'ValeurPourPourcentage', 
        required: [true, "Quelle est la valeur utilisée"]
   },
    pourcentage: { 
        type: Number,
        required: [true, "Vous devez entrer un pourcentage"],
    },
    date: { 
        type: Date,
        required: [true, "Vous devez entrer  une date"]
    }
}, { timestamps: true });

module.exports = mongoose.model('HistoriquePourcentageAvance', HistoriquePourcentageAvanceSchema);

