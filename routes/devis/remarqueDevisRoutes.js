const express = require('express');
const RemarqueDevis = require('../../models/devis/RemarqueDevis');
const router = express.Router();

router.get('/devis/:devisId', async (req, res) => {
    try {
        const { devisId } = req.params;
        const remarques = await RemarqueDevis.find({ devisId });

        res.json({ data: remarques });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;