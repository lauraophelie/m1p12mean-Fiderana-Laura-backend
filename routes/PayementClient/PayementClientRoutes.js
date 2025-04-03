const express = require('express');
const router = express.Router();
const PayementClient = require('../../models/PayementClient/PayementClient');

router.post('/', async (req, res) => {
    try {
        const payementClient = new PayementClient(req.body);
        await payementClient.save();
        res.status(201).json(payementClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les payementClient
router.get('/', async (req, res) => {
    try {
        const payementClient = await PayementClient.find();
        res.json(payementClient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une payementClient
router.put('/:id', async (req, res) => {
    try {
        const payementClient = await PayementClient.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(payementClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un PayementClient
router.delete('/:id', async (req, res) => {
    try {
        await PayementClient.findByIdAndDelete(req.params.id);
        res.json({ message: "PayementClient supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;