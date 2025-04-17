const express = require('express');
const router = express.Router();
const Poste = require('../models/Poste/Poste');
const HistoriqueSalaireBase = require('../../models/Poste/HistoriqueSalaireBase');

router.post('/', async (req, res) => {
    try {
        const poste = new Poste(req.body);
        await poste.save();

        const historique = new HistoriqueSalaireBase({
            idPoste: poste._id,
            valeur: poste.salaireBase,
            date: new Date()
        });
        await historique.save();

        res.status(201).json(poste);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
 const postes = await Poste.find().populate("profil","nomProfil");
 res.json(postes);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const oldPoste = await Poste.findById(req.params.id);

        const updatedPoste = await Poste.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (req.body.salaireBase !== undefined && req.body.salaireBase !== oldPoste.salaireBase) {
            const historique = new HistoriqueSalaireBase({
                idPoste: updatedPoste._id,
                valeur: updatedPoste.salaireBase,
                date: new Date()
            });
            await historique.save();
        }

        res.json(updatedPoste);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
    await Poste.findByIdAndDelete(req.params.id);
    res.json({ message: "Poste supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
module.exports = router;