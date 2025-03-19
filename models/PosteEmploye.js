const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const PosteEmployeSchema = new mongoose.Schema({
 employe: { type: SchemaTypes.ObjectId,ref: 'Employe', required: true },
 poste: {type: SchemaTypes.ObjectId,ref: 'Poste', required: true },
 dateEmbauche: { type : Date, required: true }
}, { timestamps: true });
module.exports = mongoose.model('PosteEmploye', PosteEmployeSchema);