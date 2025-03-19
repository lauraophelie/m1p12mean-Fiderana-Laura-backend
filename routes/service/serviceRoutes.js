const express = require('express');
const router = express.Router();

const Service = require('../../models/service/Service');
const Prestation = require('../../models/prestation/Prestation');

const { validateService } = require('../../middlewares/validators/service/validateDataService');

router.post('/', validateService, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
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
        const services = await Service.find();
        res.json({ data : services });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const [services, total] = await Promise.all([
            Service.find().skip(skip).limit(limit).exec(),
            Service.countDocuments().exec()
        ]);
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: services,
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        const service = await Service.findById(serviceId);
        res.json({ data: service });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/prestations/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        const prestations = await Prestation.find({ serviceId }).select("_id nomPrestation descriptionPrestation");
        const countPrestations = await Prestation.countDocuments({ serviceId: serviceId });

        res.json(
            { data: prestations, count: countPrestations }
        );
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;