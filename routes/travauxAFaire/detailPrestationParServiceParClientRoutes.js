const express = require('express');
const router = express.Router();
const DetailPrestationParServiceParClient = require('../models/DetailPrestationParServiceParClient');

// 🔹 Créer un détail de prestation
router.post('/', async (req, res) => {
    try {
        const detail = new DetailPrestationParServiceParClient(req.body);
        await detail.save();
        res.status(201).json(detail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 🔹 Lire tous les détails de prestation
router.get('/', async (req, res) => {
    try {
        const details = await DetailPrestationParServiceParClient.find()
            .populate("idPrestationParServiceParClient")
            .populate("idMecanicien", "nom prenom");
        res.json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 Lire un détail spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const detail = await DetailPrestationParServiceParClient.findById(req.params.id)
            .populate("idPrestationParServiceParClient")
            .populate("idMecanicien", "nom prenom");

        if (!detail) {
            return res.status(404).json({ message: "Détail non trouvé" });
        }

        res.json(detail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 Mettre à jour un détail de prestation
router.put('/:id', async (req, res) => {
    try {
        const detail = await DetailPrestationParServiceParClient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!detail) {
            return res.status(404).json({ message: "Détail non trouvé" });
        }

        res.json(detail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 🔹 Supprimer un détail de prestation
router.delete('/:id', async (req, res) => {
    try {
        const detail = await DetailPrestationParServiceParClient.findByIdAndDelete(req.params.id);

        if (!detail) {
            return res.status(404).json({ message: "Détail non trouvé" });
        }

        res.json({ message: "Détail supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
