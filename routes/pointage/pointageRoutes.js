// routes/pointage/pointage.routes.js
const express = require('express');
const router = express.Router();
const Pointage = require('../../models/Pointage/Pointage');

router.post('/', async (req, res) => {
    try {
        const pointage = new Pointage(req.body);
        await pointage.save();
        res.status(201).json(pointage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const pointages = await Pointage.find().populate('idEmploye');
        res.json(pointages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Pointage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Pointage.findByIdAndDelete(req.params.id);
        res.json({ message: "Pointage supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/mois', async (req, res) => {
    try {
        const { idEmploye, mois, annee } = req.query;

        if (!idEmploye || !mois || !annee) {
            return res.status(400).json({ message: 'idEmploye, mois et annee sont requis' });
        }

        const dateDebut = new Date(annee, mois - 1, 1); // mois - 1 car JS commence à 0
        const dateFin = new Date(annee, mois, 0, 23, 59, 59, 999); // dernier jour du mois

        const pointages = await Pointage.find({
            idEmploye,
            date: { $gte: dateDebut, $lte: dateFin }
        }).populate('idEmploye');

        res.json(pointages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/entre-deux-dates', async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.query;

        if (!dateDebut || !dateFin) {
            return res.status(400).json({ message: 'dateDebut et dateFin sont requis' });
        }

        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        fin.setHours(23, 59, 59, 999); // inclure toute la journée de fin

        const pointages = await Pointage.find({
            date: { $gte: debut, $lte: fin }
        }).populate('idEmploye');

        res.json(pointages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
