const express = require('express');
const router = express.Router();
const MontantClientService = require('../../models/clientService/montantServiceClient');

router.post('/', async (req, res) => {
    try {
        const montantClientService = new MontantClientService(req.body);
        await montantClientService.save();
        res.status(201).json(montantClientService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les montantClientService
router.get('/', async (req, res) => {
    try {
        const montantClientService = await MontantClientService.find();
        res.json(montantClientService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une montantClientService
router.put('/:id', async (req, res) => {
    try {
        const montantClientService = await MontantClientService.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(montantClientService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un MontantClientService
router.delete('/:id', async (req, res) => {
    try {
        await MontantClientService.findByIdAndDelete(req.params.id);
        res.json({ message: "MontantClientService supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;