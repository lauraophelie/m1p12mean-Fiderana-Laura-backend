const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Employe=require("../models/Employe");
const bcrypt=require("bcryptjs"); 
const jwt=require("jsonwebtoken")

router.post('/', async (req, res) => {
 try {
 const {mail,mdp,profil} =req.body;
 let utilisateur={};
 let role="";
 if(profil.toLowerCase()==="client".toLowerCase()){
    utilisateur= await Client.findOne({mail})
    role="client";
 }else if (profil === "mecanicien") {
   utilisateur = await Employe.findOne({ mail })
       .populate({
           path: 'poste',
           populate: { path: 'profil', select: 'nomProfil' }
       });
      role="mecanicien";
      if (!utilisateur || utilisateur.poste?.profil?.nomProfil.toLowerCase() !== "mecanicien".toLowerCase()) {
         utilisateur = null;
         role="";
      }
   } else if (profil.toLowerCase() === "manager".toLowerCase()) {
      utilisateur = await Employe.findOne({ mail })
          .populate({
              path: 'poste',
              populate: { path: 'profil', select: 'nomProfil' }
          });
         role="manager";
         if (!utilisateur || utilisateur.poste?.profil?.nomProfil.toLowerCase() !== "manager".toLowerCase()) {
            utilisateur = null; 
            role="";
         }

      }
 if(utilisateur && await bcrypt.compare(mdp,utilisateur.mdp)){
    const accessToken=jwt.sign({
        utilisateur:{
            id:utilisateur._id,
            role:role
        }
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"100000m"}
)
    res.status(200).json({accessToken});

 }else{
    res.status(401)
    throw new Error("Mot de passe incorrect")
 }
 } catch (error) {
 res.status(400).json({ message: error.message });
 console.log(error.message )
 }
});
module.exports = router;
