const express = require('express');
const router = express.Router();
const ValeurPourPourcentage = require('../../models/pourcentage/valeurPourPourcentage');

router.post('/', async (req, res) => {
    try {
        const valeurPourPourcentage = new ValeurPourPourcentage(req.body);
        await valeurPourPourcentage.save();
        res.status(201).json(valeurPourPourcentage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les valeurPourPourcentage
router.get('/', async (req, res) => {
    try {
        const valeurPourPourcentage = await ValeurPourPourcentage.find();
        res.json(valeurPourPourcentage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une valeurPourPourcentage
router.put('/:id', async (req, res) => {
    try {
        const valeurPourPourcentage = await ValeurPourPourcentage.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(valeurPourPourcentage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un ValeurPourPourcentage
router.delete('/:id', async (req, res) => {
    try {
        await ValeurPourPourcentage.findByIdAndDelete(req.params.id);
        res.json({ message: "ValeurPourPourcentage supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;