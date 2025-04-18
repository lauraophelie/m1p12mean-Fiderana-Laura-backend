const express = require('express');
const router = express.Router();
const FicheDePaie = require('../../models/ficheDePaie/FicheDePaie');

// ➕ Ajouter une fiche de paie
router.post('/', async (req, res) => {
    try {
        const fiche = new FicheDePaie(req.body);
        await fiche.save();
        res.status(201).json(fiche);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📥 Obtenir toutes les fiches de paie
router.get('/', async (req, res) => {
    try {
        const fiches = await FicheDePaie.find();
        res.json(fiches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✏️ Mettre à jour une fiche de paie
router.put('/:id', async (req, res) => {
    try {
        const fiche = await FicheDePaie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(fiche);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ❌ Supprimer une fiche de paie
router.delete('/:id', async (req, res) => {
    try {
        await FicheDePaie.findByIdAndDelete(req.params.id);
        res.json({ message: 'Fiche supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 🔍 Fiche par idEmploye + dateDebut + dateFin
router.post('/filtreEmployeDates', async (req, res) => {
    const { idEmploye, dateDebut, dateFin } = req.body;

    try {
        const fiches = await FicheDePaie.find({
            idEmploye,
            dateDebut: { $gte: new Date(dateDebut) },
            dateFin: { $lte: new Date(dateFin) }
        });

        res.json(fiches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔍 Fiche par idEmploye uniquement (avec pagination)
router.post('/filtreParEmploye', async (req, res) => {
    const { idEmploye, page = 1, limit = 10 } = req.body;

    try {
        const skip = (page - 1) * limit;

        const fiches = await FicheDePaie.find({ idEmploye })
            .skip(skip)
            .limit(limit);

        const total = await FicheDePaie.countDocuments({ idEmploye });

        res.json({
            data: fiches,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔍 Fiche par dateDebut et dateFin uniquement (avec pagination)
router.post('/filtreParDates', async (req, res) => {
    const { dateDebut, dateFin, page = 1, limit = 10 } = req.body;

    try {
        const skip = (page - 1) * limit;

        const fiches = await FicheDePaie.find({
            dateDebut: { $gte: new Date(dateDebut) },
            dateFin: { $lte: new Date(dateFin) }
        })
            .skip(skip)
            .limit(limit);

        const total = await FicheDePaie.countDocuments({
            dateDebut: { $gte: new Date(dateDebut) },
            dateFin: { $lte: new Date(dateFin) }
        });

        res.json({
            data: fiches,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
