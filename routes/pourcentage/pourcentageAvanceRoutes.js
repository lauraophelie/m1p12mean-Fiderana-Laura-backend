const express = require('express');
const router = express.Router();
const PourcentageAvance = require('../../models/pourcentage/PourcentageAvance');
const HistoriquePourcentageAvance=require("../../models/pourcentage/HistoriquePourcentage");
router.post('/', async (req, res) => {
    try {
        // Créer un nouvel enregistrement pour le PourcentageAvance
        const pourcentageAvance = new PourcentageAvance(req.body);
        
        // Sauvegarder l'enregistrement dans la collection PourcentageAvance
        await pourcentageAvance.save();

        // Créer une entrée pour l'historique
        const historiquePourcentageAvance = new HistoriquePourcentageAvance({
            idValeurPourPourcentage: pourcentageAvance.idValeurPourPourcentage, // utiliser la valeur du modèle
            pourcentage: pourcentageAvance.pourcentage, // pourcentage du nouveau pourcentage
            date: pourcentageAvance.date // date actuelle
        });

        // Sauvegarder l'historique
        await historiquePourcentageAvance.save();

        // Retourner la réponse avec l'objet pourcentageAvance
        res.status(201).json(pourcentageAvance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les pourcentageAvance
router.get('/', async (req, res) => {
    try {
        const pourcentageAvance = await PourcentageAvance.find();
        res.json(pourcentageAvance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une pourcentageAvance
router.put('/:id', async (req, res) => {
    try {
        // 1. Récupérer l'ancienne valeur de pourcentageAvance
        const pourcentageAvance = await PourcentageAvance.findById(req.params.id);

        if (!pourcentageAvance) {
            return res.status(404).json({ message: "PourcentageAvance non trouvé" });
        }

        const historique = new HistoriquePourcentageAvance({
            idValeurPourPourcentage: pourcentageAvance.idValeurPourPourcentage, // L'id de la valeur
            pourcentage: pourcentageAvance.pourcentage, // La valeur précédente
            date: pourcentageAvance.date,
        });
        await historique.save(); 

        // 3. Mettre à jour le pourcentageAvance avec les nouvelles données
        const updatedPourcentageAvance = await PourcentageAvance.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // 4. Retourner le pourcentageAvance mis à jour
        res.json(updatedPourcentageAvance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un PourcentageAvance
router.delete('/:id', async (req, res) => {
    try {
        await PourcentageAvance.findByIdAndDelete(req.params.id);
        res.json({ message: "PourcentageAvance supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;