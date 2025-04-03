const express = require('express');
const router = express.Router();

const Marque = require('../../models/marque/Marque');
const Modele = require('../../models/marque/Modele');

const { validateMarque } = require('../../middlewares/validators/marque/validateDataMarque');
const PrestationMarque = require('../../models/prestation/PrestationMarque');

router.post('/', validateMarque, async (req, res) => {
    try {
        const marque = new Marque(req.body);
        await marque.save();
        res.status(201).json(marque);
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

router.get('/:marqueId', async (req, res) => {
    try {
        const { marqueId } = req.params;
        const marque = await Marque.findById(marqueId);

        res.json({ data: marque });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/prestations/:marqueId', async (req, res) => {
    try {
        const { marqueId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const prestationsMarque = await PrestationMarque.find({ marqueId })
            .populate({ path: "prestationId", select: "nomPrestation descriptionPrestation" })
            .select("prestationId tarif dureeEstimee")
            .skip(skip).limit(limit);

        const countPrestations = await PrestationMarque.countDocuments({ marqueId: marqueId });

        res.json({
            data: prestationsMarque,
            count: countPrestations,
            currentPage: page,
            totalPages: Math.ceil(countPrestations / limit),
            totalItems: countPrestations,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;