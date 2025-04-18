const express = require('express');
const router = express.Router();
const CongeEmploye = require('../models/CongeEmploye');

// ➕ Créer un enregistrement de congé
router.post('/', async (req, res) => {
  try {
    const conge = new CongeEmploye(req.body);
    await conge.save();
    res.status(201).json(conge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📥 Lire tous les congés
router.get('/', async (req, res) => {
  try {
    const conges = await CongeEmploye.find().populate('idEmploye', 'nom prenom');
    res.json(conges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔄 Mettre à jour un congé
router.put('/:id', async (req, res) => {
  try {
    const conge = await CongeEmploye.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(conge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ❌ Supprimer un congé
router.delete('/:id', async (req, res) => {
  try {
    await CongeEmploye.findByIdAndDelete(req.params.id);
    res.json({ message: 'Congé supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
