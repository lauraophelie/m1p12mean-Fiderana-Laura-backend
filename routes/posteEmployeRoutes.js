const express = require('express');
const router = express.Router();
const PosteEmploye = require('../models/PosteEmploye');
// Créer un posteEmploye
router.post('/', async (req, res) => {
 try {
 const posteEmploye = new PosteEmploye(req.body);
 await posteEmploye.save();
 res.status(201).json(posteEmploye);
 } catch (error) {
 res.status(400).json({ message: error.message });
 }
});
// Lire tous les posteEmployes
router.get('/', async (req, res) => {
 try {
 const posteEmployes = await PosteEmploye.find().populate({path:"employe",select:"nomEmploye prenom"}).populate({path:"poste",select:"nomPoste"});
 res.json(posteEmployes);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});
// Mettre à jour un posteEmploye
router.put('/:id', async (req, res) => {
    try {
    const posteEmploye = await PosteEmploye.findByIdAndUpdate(req.params.id,
   req.body, { new: true });
    res.json(posteEmploye);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});
   // Supprimer un posteEmploye
router.delete('/:id', async (req, res) => {
    try {
    await PosteEmploye.findByIdAndDelete(req.params.id);
    res.json({ message: "posteEmploye supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
module.exports = router;