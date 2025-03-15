const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const PosteSchema = new mongoose.Schema({
 nomPoste: { type: String, required: true },
 description: { type: String, required: false },
 profil: { type: SchemaTypes.ObjectId,ref: 'Profil', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Poste', PosteSchema);