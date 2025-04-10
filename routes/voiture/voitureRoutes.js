const express = require('express');
const Voiture = require('../../models/voiture/Voiture');
const router = express.Router();
const { validateVoiture } = require('../../middlewares/validators/voitures/validateVoiture');
const DetailsVoiture = require('../../models/voiture/DetailsVoiture');
const upload = require('../../config/storage');

router.post('/', upload.array('images', 5), validateVoiture, async (req, res) => {
    try {
        const voiture = new Voiture(req.body);
        await voiture.save();

        if (req.files || req.files.length > 0) {
            const imagePaths = req.files.map(file => file.path);
            const detailsVoiture = new DetailsVoiture({
                voitureId: voiture._id,
                remarques: req.body.remarques,
                images: imagePaths
            });
            await detailsVoiture.save();
        }
        res.status(201).json(voiture);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ message: 'Le fichier est trop volumineux. Taille maximale autorisée : 3 Mo.' });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/:voitureId', validateVoiture, async (req, res) => {
    try {
        const voiture = await Voiture.findByIdAndUpdate(req.params.voitureId, req.body, { new: true });
        res.json(voiture);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/:voitureId', async (req, res) => {
    try {
        const { voitureId } = req.params;
        const voiture = await Voiture.findById(voitureId)
            .populate({ path: "marqueId", select: "designationMarque"})
            .populate({ path: "modeleId", select: "designationModele"})
            .populate({ path: "categorieVoitureId", select: "designationCategorie"})
            .populate({ path: "typeEnergieId", select: "designationTypeEnergie"})
            .populate({ path: "boiteVitesseId", select: "designationBoite"});
        res.json({ data: voiture });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const voiture = await Voiture.find()
            .populate({ path: "marqueId", select: "designationMarque"})
            .populate({ path: "modeleId", select: "designationModele"})
            .populate({ path: "categorieVoitureId", select: "designationCategorie"})
            .populate({ path: "typeEnergieId", select: "designationTypeEnergie"})
            .populate({ path: "boiteVitesseId", select: "designationBoite"});
        res.json({ data: voiture });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/all/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        const voituresClient = await Voiture.find({ clientId })
            .populate({ path: "marqueId", select: "designationMarque"})
            .populate({ path: "modeleId", select: "designationModele"});
        res.json({ data: voituresClient });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const voituresClient = await Voiture.find({ clientId })
            .populate({ path: "marqueId", select: "designationMarque"})
            .populate({ path: "modeleId", select: "designationModele"})
            .populate({ path: "categorieVoitureId", select: "designationCategorie"})
            .populate({ path: "typeEnergieId", select: "designationTypeEnergie"})
            .populate({ path: "boiteVitesseId", select: "designationBoite"})
            .skip(skip).limit(limit);
        const countVoitureClient = await Voiture.countDocuments({ clientId: clientId });

        res.json({
            data: voituresClient,
            count: countVoitureClient,
            currentPage: page,
            totalPages: Math.ceil(countVoitureClient / limit),
            totalItems: countVoitureClient,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;