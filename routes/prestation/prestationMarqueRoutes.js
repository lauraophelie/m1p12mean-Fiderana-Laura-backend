const express = require('express');
const PrestationMarque = require('../../models/prestation/PrestationMarque');
const router = express.Router();
const { validatePrestationMarque } = require('../../middlewares/validators/prestation/validateDataPrestation'); 

router.post('/', validatePrestationMarque, async (req, res) => {
    try {
        const prestationsMarque = await PrestationMarque.insertMany(req.body);
        res.status(201).json(prestationsMarque);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', validatePrestationMarque, async (req, res) => {
    try {
        const prestationMarque = await PrestationMarque.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(prestationMarque);
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
        const prestationsMarque = await PrestationMarque.find();
        res.json({ data : prestationsMarque });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;