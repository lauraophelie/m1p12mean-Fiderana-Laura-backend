const express = require('express');
const BoiteVitesse = require('../../models/voiture/BoiteVitesse');
const CategorieVoiture = require('../../models/voiture/CategorieVoiture');
const TypeEnergie = require('../../models/voiture/TypeEnergie');
const router = express.Router();

/// boite de vitesse
router.post('/vitesse', async (req, res) => {
    try {
        const boiteVitesse = new BoiteVitesse(req.body);
        await boiteVitesse.save();
        res.status(201).json(boiteVitesse);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/vitesse', async (req, res) => {
    try {
        const boiteVitesse = await BoiteVitesse.find();
        res.json({ data: boiteVitesse })
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

/// catégorie de voiture 
router.post('/categorieVoiture', async (req, res) => {
    try {
        const categorieVoiture = new CategorieVoiture(req.body);
        await categorieVoiture.save();
        res.status(201).json(categorieVoiture);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/categorieVoiture', async (req, res) => {
    try {
        const categories = await CategorieVoiture.find();
        res.json({ data: categories });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

/// type d'énergie
router.post('/typeEnergie', async (req, res) => {
    try {
        const typeEnergie = new TypeEnergie(req.body);
        await typeEnergie.save();
        res.status(201).json(typeEnergie);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/typeEnergie', async (req, res) => {
    try {
        const energies = await TypeEnergie.find();
        res.json({ data: energies });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;