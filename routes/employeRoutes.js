const express = require('express');
const router = express.Router();
const Employe = require('../models/Employe');
// Créer un employe
router.post('/', async (req, res) => {
 try {
 const employe = new Employe(req.body);
 await employe.save();
 res.status(201).json(employe);
 } catch (error) {
 res.status(400).json({ message: error.message });
 }
});
// Lire tous les employes
router.get('/', async (req, res) => {
 try {
 const employes = await Employe.find().populate("poste","nomPoste");
 res.json(employes);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});
// Mettre à jour un employe
router.put('/:id', async (req, res) => {
    try {
    const employe = await Employe.findByIdAndUpdate(req.params.id,
   req.body, { new: true });
    res.json(employe);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});
   // Supprimer un employe
router.delete('/:id', async (req, res) => {
    try {
    await Employe.findByIdAndDelete(req.params.id);
    res.json({ message: "Employe supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
module.exports = router;