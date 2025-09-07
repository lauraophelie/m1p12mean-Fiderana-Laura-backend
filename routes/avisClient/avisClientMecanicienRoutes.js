const express = require('express');
const AvisClientMecanicien = require('../../models/avisClient/AvisClientMecanicien');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const avisClient = new AvisClientMecanicien(req.body);
        await avisClient.save();

        res.status(201).json(avisClient);
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
        const avisClients = await AvisClientMecanicien.find();
        res.json({ data: avisClients });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:avisId', async (req, res) => {
    try {
        const { avisId } = req.params;
        const avis = await AvisClientMecanicien.findById(avisId);

        res.json({ data: avis });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/mecanicien/:mecanicienId', async (req, res) => {
    try {
        const { mecanicienId } = req.params;
        const avisMecanicien = await AvisClientMecanicien.find({ mecanicienId });

        res.json({ data: avisMecanicien });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;