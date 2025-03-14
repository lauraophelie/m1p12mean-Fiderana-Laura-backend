const express = require('express');
const Prestation = require('../../models/prestation/Prestation');
const router = express.Router();
const { validatePrestation } = require('../../middlewares/validators/prestation/validateDataPrestation');
const PrestationMarque = require('../../models/prestation/PrestationMarque');

router.get('/', async (req, res) => {
    try {
        const prestations = await Prestation.find().populate("serviceId");
        res.json({ data : prestations });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:prestationId', async (req, res) => {
    try {
        const { prestationId } = req.params;
        const prestation = await Prestation.findById(prestationId).populate("serviceId");

        res.json({ data : prestation })
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/marques/:prestationId', async (req, res) => {
    try {
        const { prestationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const marquesPrestation = await PrestationMarque.find({ prestationId })
            .populate({ path: "marqueId", select: "designationMarque" })
            .select("marqueId tarif dureeEstimee")
            .skip(skip).limit(limit);
        const countMarques = await PrestationMarque.countDocuments({ prestationId: prestationId });

        res.json({ 
                data: marquesPrestation, 
                count: countMarques,
                currentPage: page,
                totalPages: Math.ceil(countMarques / limit),
                totalItems: countMarques,
                itemsPerPage: limit
        });                                                
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [prestations, total] = await Promise.all([
            Prestation.find().populate("serviceId").skip(skip).limit(limit).exec(),
            Prestation.countDocuments().exec()
        ]);
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: prestations,
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.post('/', validatePrestation, async (req, res) => {
    try {
        const prestation = new Prestation(req.body);
        await prestation.save();
        res.status(201).json(prestation);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;