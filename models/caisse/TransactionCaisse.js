const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const TransactionCaisseSchema = new mongoose.Schema({
    idCaisse: { 
        type: SchemaTypes.ObjectId,
        ref: 'Caisse',
        unique: true
    },
    typeOperation: { //entre ou sortie
        type: String
    },
    montant: { 
        type: Number
    },
    motif: { 
        type: String 
    },
    dateOperation :{
        type:Date
    },
    employeResponsable: {
        type: SchemaTypes.ObjectId,ref: 'employe', required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('TransactionCaisse', TransactionCaisseSchema);