const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");

const validationToken=asyncHandler(async(req,res,next)=>{
    let token;
    let authHeader = req.headers.authorization; // "authorization" en minuscules
;

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

const verifierRole = (...roles) => {
    return (req, res, next) => {
        if (!req.uti || !roles.includes(req.uti.role)) {
            return res.status(403).json({ message: "Accès refusé, vous n'avez pas accès à cette page" });
        }
        next();
    };
};

module.exports = { validationToken, verifierRole };

// https://www.google.com/search?q=login+node+js+express+mongodb&oq=authentification+express+JS+mon&gs_lcrp=EgZjaHJvbWUqCAgBEAAYFhgeMgYIABBFGDkyCAgBEAAYFhgeMgoIAhAAGIAEGKIEMgcIAxAAGO8FMgcIBBAAGO8FMgcIBRAAGO8F0gEJMTcyMTJqMGo3qAIIsAIB8QW-PvyAwb2tzA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:273e4be0,vid:ICMnoKxlYYg,st:0