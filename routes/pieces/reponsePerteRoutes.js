const express = require('express');
const ReponsePerte = require('../../models/pieces/perte/ReponsePerte');
const router = express.Router();

router.get('/perte/:perteId', async (req, res) => {
    try {
        const { perteId } = req.params;
        const reponsePerte = await ReponsePerte.find({ perteId })
            .populate({ path: "managerId", select: "nomEmploye prenom" });
        res.json({ data: reponsePerte });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;