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
 if(profil=="client"){
    utilisateur= await Client.findOne({mail}).populate("poste").populate("profil","nomProfil");
 }else{
    utilisateur= await Employe.findOne({mail}).populate({path:'poste',populate:{path: 'profil', select: 'nomProfil'} });
 }
 console.log(utilisateur)
 if(utilisateur && await bcrypt.compare(mdp,utilisateur.mdp)){
    const accessToken=jwt.sign({
        utilisateur:{
            id:utilisateur._id,
            role:utilisateur.poste.profil.nomProfil
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
 }
});
module.exports = router;
