const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");

const validationToken=asyncHandler(async(req,res,next)=>{

    let token;
    let authHeader = req.headers.authorization; // "authorization" en minuscules

    console.log("Authorization Header:", authHeader);

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]; // Récupère uniquement le token après "Bearer"

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.uti = decoded.utilisateur; // Stocke les infos de uti pour les prochains middlewares
            console.log("Utilisateur décodé:", req.uti);
            next(); // Passe au middleware suivant
        } catch (err) {
            res.status(401);
            throw new Error("Session expiré ou token non validé, veuillez vous reconnecter");
        }
    } else {
        res.status(401);
        throw new Error("Aucun token fourni, accès refusé");
    }
})
module.exports  =validationToken;