const express = require('express');
const router = express.Router();
const Poste = require('../models/Poste');
// Créer un poste
router.post('/', async (req, res) => {
 try {
 const poste = new Poste(req.body);
 await poste.save();
 res.status(201).json(poste);
 } catch (error) {
 res.status(400).json({ message: error.message });
 }
});
// Lire tous les postes
router.get('/', async (req, res) => {
 try {
 const postes = await Poste.find().populate("profil","nomProfil");
 res.json(postes);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});
// Mettre à jour un poste
router.put('/:id', async (req, res) => {
    try {
    const poste = await Poste.findByIdAndUpdate(req.params.id,
   req.body, { new: true });
    res.json(poste);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});
   // Supprimer un poste
router.delete('/:id', async (req, res) => {
    try {
    await Poste.findByIdAndDelete(req.params.id);
    res.json({ message: "Poste supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
module.exports = router;