const express = require('express');
const router = express.Router();
const Caisse = require('../../models/caisse/Caisse');

router.post('/', async (req, res) => {
    try {
        const caisse = new Caisse(req.body);
        await caisse.save();
        res.status(201).json(caisse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les Caisses
router.get('/', async (req, res) => {
    try {
        const caisses = await Caisse.find();
        res.json(caisses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une caisse
router.put('/:id', async (req, res) => {
    try {
        const caisse = await Caisse.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(caisse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un Caisse
router.delete('/:id', async (req, res) => {
    try {
        await Caisse.findByIdAndDelete(req.params.id);
        res.json({ message: "Caisse supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;