const express = require('express');
const router = express.Router();
const PourcentageAvance = require('../../models/pourcentage/PourcentageAvance');

router.post('/', async (req, res) => {
    try {
        const pourcentageAvance = new PourcentageAvance(req.body);
        await pourcentageAvance.save();
        res.status(201).json(pourcentageAvance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les pourcentageAvance
router.get('/', async (req, res) => {
    try {
        const pourcentageAvance = await PourcentageAvance.find();
        res.json(pourcentageAvance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une pourcentageAvance
router.put('/:id', async (req, res) => {
    try {
        const pourcentageAvance = await PourcentageAvance.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(pourcentageAvance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un PourcentageAvance
router.delete('/:id', async (req, res) => {
    try {
        await PourcentageAvance.findByIdAndDelete(req.params.id);
        res.json({ message: "PourcentageAvance supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;