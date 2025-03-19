class Authentification {
    constructor(email, mdp, profil) {
        this.email = email;
        this.mdp = mdp;
        this.profil = profil;
    }
}


function avoirUtilisateur(req) {
    const {  email, mdp, profil} = req.body; // Extraction des données du corps

    // Vérification des champs requis
    if (!profil || !email || !mdp) {
        throw new Error("Tous les champs (profil, email, mdp) sont requis !");
    }

    // Création de l'objet sans Mongoose
    return new Authentification(email, mdp,profil);
}
exports={avoirUtilisateur}
