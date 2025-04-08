const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const TransactionCaisseSchema = new mongoose.Schema({
    idCaisse: { 
        type: SchemaTypes.ObjectId,
        ref: 'Caisse'
    },
    typeOperation: { //entre ou sortie
        type: Number
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
        type: SchemaTypes.ObjectId,ref: 'Employe', required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('TransactionCaisse', TransactionCaisseSchema);