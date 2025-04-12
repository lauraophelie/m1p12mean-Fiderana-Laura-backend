const express = require('express');
const router = express.Router();
const HistoriquePourcentageAvance = require('../../models/pourcentage/HistoriquePourcentage');

// Créer un nouvel historique de pourcentage d'avance
router.post('/', async (req, res) => {
    try {
        const historiquePourcentageAvance = new HistoriquePourcentageAvance(req.body);
        await historiquePourcentageAvance.save();
        res.status(201).json(historiquePourcentageAvance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire tous les historiques de pourcentage d'avance
router.get('/', async (req, res) => {
    try {
        const historiquesPourcentageAvance = await HistoriquePourcentageAvance.find()
            .populate('idValeurPourPourcentage'); // Populer les valeurs liées
        res.json(historiquesPourcentageAvance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lire un historique de pourcentage d'avance par ID
router.get('/:id', async (req, res) => {
    try {
        const historiquePourcentageAvance = await HistoriquePourcentageAvance.findById(req.params.id)
            .populate('idValeurPourPourcentage');
        
        if (!historiquePourcentageAvance) {
            return res.status(404).json({ message: "Historique non trouvé" });
        }

        res.json(historiquePourcentageAvance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un historique de pourcentage d'avance
router.put('/:id', async (req, res) => {
    try {
        const historiquePourcentageAvance = await HistoriquePourcentageAvance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!historiquePourcentageAvance) {
            return res.status(404).json({ message: "Historique non trouvé" });
        }

        res.json(historiquePourcentageAvance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un historique de pourcentage d'avance
router.delete('/:id', async (req, res) => {
    try {
        const historiquePourcentageAvance = await HistoriquePourcentageAvance.findByIdAndDelete(req.params.id);
        
        if (!historiquePourcentageAvance) {
            return res.status(404).json({ message: "Historique non trouvé" });
        }

        res.json({ message: "Historique supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
