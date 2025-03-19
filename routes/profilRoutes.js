const express = require('express');
const router = express.Router();
const Profil = require('../models/Profil');
// Créer un profil
router.post('/', async (req, res) => {
 try {
 const profil = new Profil(req.body);
 await profil.save();
 res.status(201).json(profil);
 } catch (error) {
 res.status(400).json({ message: error.message });
 }
});
// Lire tous les profils
router.get('/', async (req, res) => {
 try {
 const profils = await Profil.find();
 res.json(profils);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});
// Mettre à jour un profil
router.put('/:id', async (req, res) => {
    try {
    const profil = await Profil.findByIdAndUpdate(req.params.id,
   req.body, { new: true });
    res.json(profil);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});
   // Supprimer un profil
router.delete('/:id', async (req, res) => {
    try {
    await Profil.findByIdAndDelete(req.params.id);
    res.json({ message: "Profil supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
module.exports = router;