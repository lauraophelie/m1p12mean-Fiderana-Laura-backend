const express = require('express');
const Devis = require('../../models/devis/Devis');
const RemarqueDevis = require('../../models/devis/RemarqueDevis');
const Diagnostique = require('../../models/diagnostique/Diagnostique');
const router = express.Router();

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const diagnostiques = await Diagnostique.find()
            .populate({ 
                path: "idRendezVous", 
                select: "dateRdv heureRdv clientId voitureId",
                populate: [
                    { path: "clientId", select: "nomClient prenom"}
                ]
             })
            .skip(skip).limit(limit);
        const countDiagnostiques = await Diagnostique.countDocuments();

        res.json({
            data: diagnostiques,
            count: countDiagnostiques,
            currentPage: page,
            totalPages: Math.ceil(countDiagnostiques / limit),
            totalItems: countDiagnostiques,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

// validation par le manager
router.post('/validation/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validation = await Diagnostique.updateDiagnoStatus(id, 10);
        res.json(validation);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/refus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const remarqueDevis = new RemarqueDevis(req.body);

        await remarqueDevis.save();
        await Diagnostique.updateDiagnoStatus(id, 0);

        res.json(remarqueDevis);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const detailsDevis = await Devis.getDetailsDevis(id);

        res.json(detailsDevis);
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/client/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const rdvIds = await RendezVous.find({ clientId }).distinct('_id');
        const diagnostiques = await Diagnostique.find({ idRendezVous: { $in: rdvIds } })
            .populate({ 
                path: "idRendezVous", 
                select: "dateRdv heureRdv clientId voitureId",
                populate: [
                    { path: "clientId", select: "nomClient prenom"}
                ]
             })
            .skip(skip).limit(limit);
        const countDiagnostiques = await Diagnostique.countDocuments({ idRendezVous: { $in: rdvIds } });

        res.json({
            data: diagnostiques,
            count: countDiagnostiques,
            currentPage: page,
            totalPages: Math.ceil(countDiagnostiques / limit),
            totalItems: countDiagnostiques,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;