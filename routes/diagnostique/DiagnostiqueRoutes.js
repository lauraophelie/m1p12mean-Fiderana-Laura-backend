const express = require('express');
const router = express.Router();
const Diagnostique = require('../../models/diagnostique/Diagnostique');

router.post('/', async (req, res) => {
    try {
        const diagnostique = new Diagnostique(req.body);
        await diagnostique.save();
        res.status(201).json(diagnostique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les diagnostique
router.get('/', async (req, res) => {
    try {
        const diagnostique = await Diagnostique.find();
        res.json(diagnostique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une diagnostique
router.put('/:id', async (req, res) => {
    try {
        const diagnostique = await Diagnostique.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(diagnostique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un diagnostique
router.delete('/:id', async (req, res) => {
    try {
        await Diagnostique.findByIdAndDelete(req.params.id);
        res.json({ message: "diagnostique supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;