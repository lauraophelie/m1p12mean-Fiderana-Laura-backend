const express = require('express');
const router = express.Router();

const Marque = require('../../models/marque/Marque');
const Modele = require('../../models/marque/Modele');

const { validateMarque } = require('../../middlewares/validators/marque/validateDataMarque');

router.post('/', validateMarque, async (req, res) => {
    try {
        const marque = new Marque(req.body);
        await marque.save();
        res.status(201).json(marque)
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const marques = await Marque.find();
        res.json({ data: marques });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/modeles/:marqueId', async (req, res) => {
    try {
        const { marqueId } = req.params;
        const modeles = await Modele.find({ marqueId });

        res.json({ data: modeles });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;