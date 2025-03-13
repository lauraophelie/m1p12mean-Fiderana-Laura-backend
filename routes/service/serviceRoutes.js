const express = require('express');
const router = express.Router();

const Service = require('../../models/service/Service');

const { validateService } = require('../../middlewares/validators/service/validateDataService');

router.post('/', validateService, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        req.status(201).json(marque);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json({ data : services });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});