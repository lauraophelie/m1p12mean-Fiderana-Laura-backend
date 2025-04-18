const express = require('express');
const router = express.Router();
const HistoriqueSalaireBase = require('../../models/historiqueSalaireBase/HistoriqueSalaireBase');

router.post('/', async (req, res) => {
    try {
        const historique = new HistoriqueSalaireBase(req.body);
        await historique.save();
        res.status(201).json(historique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const historiques = await HistoriqueSalaireBase.find().populate('idPoste');
        res.status(200).json(historiques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const historique = await HistoriqueSalaireBase.findById(req.params.id).populate('idPoste');
        if (!historique) return res.status(404).json({ message: 'Entrée non trouvée' });
        res.json(historique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const historique = await HistoriqueSalaireBase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(historique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await HistoriqueSalaireBase.findByIdAndDelete(req.params.id);
        res.json({ message: 'Entrée supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
