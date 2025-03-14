const express = require('express');
const Prestation = require('../../models/prestation/Prestation');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const prestations = await Prestation.find();
        res.json({ data : prestations });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;