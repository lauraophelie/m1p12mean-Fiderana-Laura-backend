const express = require('express');
const router = express.Router();
const ModePayement = require('../../models/modePayement/ModePayement');

router.post('/', async (req, res) => {
    try {
        const modePayement = new ModePayement(req.body);
        await modePayement.save();
        res.status(201).json(modePayement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les modePayement
router.get('/', async (req, res) => {
    try {
        const modePayement = await ModePayement.find();
        res.json(modePayement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une modePayement
router.put('/:id', async (req, res) => {
    try {
        const modePayement = await ModePayement.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(modePayement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un ModePayement
router.delete('/:id', async (req, res) => {
    try {
        await ModePayement.findByIdAndDelete(req.params.id);
        res.json({ message: "ModePayement supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;