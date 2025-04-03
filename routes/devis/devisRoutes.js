const express = require('express');
const Devis = require('../../models/devis/Devis');
const RemarqueDevis = require('../../models/devis/RemarqueDevis');
const router = express.Router();

// validation par le manager
router.post('/validation/:devisId', async (req, res) => {
    try {
        const { devisId } = req.params;
        const validation = await Devis.updateOne(
            { _id: devisId }, { $set: { status: 10 } }
        );
        res.json(validation);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/refus/:devisId', async (req, res) => {
    try {
        const { devisId } = req.params;
        const remarqueDevis = new RemarqueDevis(req.body);

        await remarqueDevis.save();
        await Devis.updateOne(
            { _id: devisId }, { $set: { status: 0 } }
        );
        res.json(remarqueDevis);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;