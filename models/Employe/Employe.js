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

EmployeSchema.statics.calculSalaireBrut = async function(heureSup,conge) {
    return this.poste.salaireBase+heureSup+conge;
}

EmployeSchema.statics.calcul = async function(heureSup,conge) {
    
}

EmployeSchema.statics.calculHeureSupParEmploye = async function(idEmploye, dateDebut, dateFin) {
    try {
        const employe = await this.findById(idEmploye).populate('poste');
        if (!employe) throw new Error("Employé introuvable");

        const dureeParJour = employe.poste.dureeParJour || 0;

        const pointages = await Pointage.find({
            idEmploye,
            date: { $gte: new Date(dateDebut), $lte: new Date(dateFin) }
        });

        let totalHeuresSup = 0;

        pointages.forEach(p => {
            const arrivee = new Date(p.heureArrivee);
            const sortie = new Date(p.heureSortie);
            const heuresTravaillees = (sortie - arrivee) / (1000 * 60 * 60); // en heures
            const heureSup = Math.max(0, heuresTravaillees - dureeParJour);
            totalHeuresSup += heureSup;
        });

        return totalHeuresSup;
    } catch (error) {
        throw new Error(error.message);
    }
};


EmployeSchema.statics.calculHeureSupTousEmployes = async function(dateDebut, dateFin) {
    try {
        const employes = await this.find().populate('poste');
        const resultats = [];

        for (let employe of employes) {
            const dureeParJour = employe.poste?.dureeParJour || 0;

            const pointages = await Pointage.find({
                idEmploye: employe._id,
                date: { $gte: new Date(dateDebut), $lte: new Date(dateFin) }
            });

            let totalHeuresSup = 0;

            pointages.forEach(p => {
                const arrivee = new Date(p.heureArrivee);
                const sortie = new Date(p.heureSortie);
                const heuresTravaillees = (sortie - arrivee) / (1000 * 60 * 60);
                const heureSup = Math.max(0, heuresTravaillees - dureeParJour);
                totalHeuresSup += heureSup;
            });

            resultats.push({
                idEmploye: employe._id,
                nom: employe.nom,
                prenom: employe.prenom,
                totalHeuresSup
            });
        }

        return resultats;
    } catch (error) {
        throw new Error(error.message);
    }
};
module.exports = mongoose.model('Employe', EmployeSchema);