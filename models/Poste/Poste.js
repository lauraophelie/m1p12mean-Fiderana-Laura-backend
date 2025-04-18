const mongoose = require('mongoose');
const {  SchemaTypes } = mongoose;

const PosteSchema = new mongoose.Schema({
 nomPoste: { type: String, required: true },
 description: { type: String, required: false },
 profil: { type: SchemaTypes.ObjectId,ref: 'Profil', required: true },
 dureeParJour:{type:Number,required:[true,"Vous devez entrer le nombre d'heure par jour pour ce poste"]},
 salaireBase:{type:Number,required:[true,"Vous devez entrer le salaire de base pour ce poste"]}
}, { timestamps: true });
module.exports = mongoose.model('Poste', PosteSchema);