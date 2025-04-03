const mongoose = require('mongoose');
const bcrypt=require("bcryptjs");

const ClientSchema = new mongoose.Schema({
 nomClient: { type: String, required: true },
 prenom: { type: String, required: true },
 adresse: { type: String, required: true },
 phone: { type: String, required: true },
 sexe: { type: Number, required: true },
 dateCreationCompte: { type: Date, required: true },
 mail: { type: String, required: true },
 mdp: { type: String, required: true }
}, { timestamps: true });

ClientSchema.pre('save',function(next){
    if(this.isModified('mdp')){
        this.mdp=bcrypt.hashSync(this.mdp,10);
    }
    next();
});
ClientSchema.pre('update',function(next){
    this.mdp=bcrypt.hashSync(this.mdp,10);

    if(this.isModified('mdp')){
        this.mdp=bcrypt.hashSync(this.mdp,10);
    }
    next();
});
module.exports = mongoose.model('Client', ClientSchema);