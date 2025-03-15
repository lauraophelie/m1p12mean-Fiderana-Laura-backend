const mongoose = require('mongoose');
const validateur=require('validator');
const bcrypt=require("bcryptjs");
const {  SchemaTypes } = mongoose;

const EmployeSchema = new mongoose.Schema({
 nomEmploye: { type: String, required: true },
 prenom: { type: String, required: true },
 matricule: { type: String, required: true ,unique:[true,'Ce matricule est déjà pris']},
 adresse: { type: String, required: true },
 phone: { type: String, required: true },
 CIN: { type: String, required: true,unique:[true,'Ce CIN appartient à un autre utilisateur']},
 sexe: { type: Number, required: true },
 poste: {type: SchemaTypes.ObjectId,ref: 'Poste', required: true },
 dateEmbauche: { type : Date, required: true },
 mail: { type: String, required: true,validate:[validateur.isEmail,"Veuillez entrer un mail valide"],unique:[true,'Cette adresse email est déjà prise']},
 mdp: { type: String, required: true } 
}, { timestamps: true });

EmployeSchema.pre('save',function(next){
    if(this.isModified('mdp')){
        this.mdp=bcrypt.hashSync(this.mdp,10);
    }
    next();
});
EmployeSchema.pre('update',function(next){
    this.mdp=bcrypt.hashSync(this.mdp,10);

    if(this.isModified('mdp')){
        this.mdp=bcrypt.hashSync(this.mdp,10);
    }
    next();
});
module.exports = mongoose.model('Employe', EmployeSchema);