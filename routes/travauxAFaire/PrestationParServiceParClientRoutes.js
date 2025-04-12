const express = require('express');
const router = express.Router();
const PrestationParServiceValideParClient = require('../../models/TravauxAFaire/PrestationParServiceValideParClient');

// 🔹 Créer une prestation validée par un client
router.post('/', async (req, res) => {
    try {
        const prestation = new PrestationParServiceValideParClient(req.body);
        await prestation.save();
        res.status(201).json(prestation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 🔹 Lire toutes les prestations validées
router.get('/', async (req, res) => {
    try {
        const prestations = await PrestationParServiceValideParClient.find()
            .populate("idPrestationMarque")
            // .populate("idMecanicienEnChef", "nom prenom")
            .populate("idDiagno");
        res.json(prestations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 Lire une prestation validée par ID
router.get('/:id', async (req, res) => {
    try {
        const prestation = await PrestationParServiceValideParClient.findById(req.params.id)
            .populate("idPrestationMarque")
            .populate("idMecanicienEnChef", "nom prenom")
            .populate("idDiagno");

        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }

        res.json(prestation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 Mettre à jour une prestation validée
router.put('/:id', async (req, res) => {
    try {
        const prestation = await PrestationParServiceValideParClient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }

        res.json(prestation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 🔹 Supprimer une prestation validée
router.delete('/:id', async (req, res) => {
    try {
        const prestation = await PrestationParServiceValideParClient.findByIdAndDelete(req.params.id);

        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }

        res.json({ message: "Prestation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
