const express = require('express');
const Monnaie = require('../../models/caisse/Monnaie'); // Assurez-vous que le modèle est bien importé

const router = express.Router();

// ➤ Ajouter une nouvelle monnaie
router.post('/', async (req, res) => {
    try {
        const { nomMonnaie, codeISO } = req.body;

        // Vérifier si la monnaie existe déjà
        const existingMonnaie = await Monnaie.findOne({ codeISO });
        if (existingMonnaie) {
            return res.status(400).json({ message: 'Cette monnaie existe déjà.' });
        }

        const nouvelleMonnaie = new Monnaie({ nomMonnaie, codeISO });
        await nouvelleMonnaie.save();

        res.status(201).json(nouvelleMonnaie);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// ➤ Récupérer toutes les monnaies
router.get('/', async (req, res) => {
    try {
        const monnaies = await Monnaie.find();
        res.json(monnaies);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// ➤ Récupérer une monnaie par son ID
router.get('/:id', async (req, res) => {
    try {
        const monnaie = await Monnaie.findById(req.params.id);
        if (!monnaie) {
            return res.status(404).json({ message: 'Monnaie non trouvée' });
        }
        res.json(monnaie);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// ➤ Mettre à jour une monnaie
router.put('/:id', async (req, res) => {
    try {
        const { nomMonnaie, codeISO } = req.body;

        const monnaie = await Monnaie.findByIdAndUpdate(
            req.params.id,
            { nomMonnaie, codeISO },
            { new: true, runValidators: true }
        );

        if (!monnaie) {
            return res.status(404).json({ message: 'Monnaie non trouvée' });
        }

        res.json(monnaie);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

// ➤ Supprimer une monnaie
router.delete('/:id', async (req, res) => {
    try {
        const monnaie = await Monnaie.findByIdAndDelete(req.params.id);
        if (!monnaie) {
            return res.status(404).json({ message: 'Monnaie non trouvée' });
        }
        res.json({ message: 'Monnaie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

module.exports = router;
