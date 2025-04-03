const express = require('express');
const router = express.Router();
const Modele = require('../../models/marque/Modele');
const { validateModele } = require('../../middlewares/validators/marque/validateDataModele');

router.post('/', validateModele, async (req, res) => {
    try {
        const modele = new Modele(req.body);
        await modele.save();
        res.status(201).json(modele);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const modeles = await Modele.find().populate("marqueId");
        res.json({ data: modeles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;