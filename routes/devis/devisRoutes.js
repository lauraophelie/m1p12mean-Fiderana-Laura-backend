const express = require('express');
const Devis = require('../../models/devis/Devis');
const RemarqueDevis = require('../../models/devis/RemarqueDevis');
const router = express.Router();

// validation par le manager
/*router.post('/validation/:devisId', async (req, res) => {
    try {
        const { devisId } = req.params;
        const validation = await Devis.updateOne(
            { _id: devisId }, { $set: { status: 10 } }
        );
        res.json(validation);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/refus/:devisId', async (req, res) => {
    try {
        const { devisId } = req.params;
        const remarqueDevis = new RemarqueDevis(req.body);

        await remarqueDevis.save();
        await Devis.updateOne(
            { _id: devisId }, { $set: { status: 0 } }
        );
        res.json(remarqueDevis);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/details/:devisId', async (req, res) => {
    try {
        const { devisId } = req.params;
        const detailsDevis = await Devis.findById(devisId);

        res.json(detailsDevis);
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const devis = await Devis.find()
            .populate("clientId")
            .populate({ path: "voitureId", select: "immatriculation"})
            .skip(skip).limit(limit);
        const countDevis = await Devis.countDocuments();

        res.json({
            data: devis,
            count: countDevis,
            currentPage: page,
            totalPages: Math.ceil(countDevis / limit),
            totalItems: countDevis,
            itemsPerPage: limit
        });
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

        const devis = await Devis.find({ clientId })
            .populate("clientId")
            .populate({ path: "voitureId", select: "immatriculation"})
            .skip(skip).limit(limit);
        const countDevis = await Devis.countDocuments({ clientId });

        res.json({
            data: devis,
            count: countDevis,
            currentPage: page,
            totalPages: Math.ceil(countDevis / limit),
            totalItems: countDevis,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});*/

module.exports = router;