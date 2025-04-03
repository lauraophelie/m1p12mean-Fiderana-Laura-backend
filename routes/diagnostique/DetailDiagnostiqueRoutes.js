const express = require('express');
const router = express.Router();
const DetailDiagnostique = require('../../models/diagnostique/DetailDiagnostique');

router.post('/', async (req, res) => {
    try {
        const detailDiagnostique = new DetailDiagnostique(req.body);
        await detailDiagnostique.save();
        res.status(201).json(detailDiagnostique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les detailDiagnostique
router.get('/', async (req, res) => {
    try {
        const detailDiagnostique = await DetailDiagnostique.find();
        res.json(detailDiagnostique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une detailDiagnostique
router.put('/:id', async (req, res) => {
    try {
        const detailDiagnostique = await DetailDiagnostique.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(detailDiagnostique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un detailDiagnostique
router.delete('/:id', async (req, res) => {
    try {
        await DetailDiagnostique.findByIdAndDelete(req.params.id);
        res.json({ message: "detailDiagnostique supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;