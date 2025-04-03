const express = require('express');
const DemandePiece = require('../../models/pieces/demande/DemandePiece');
const DetailsDemandePiece = require('../../models/pieces/demande/DetailsDemandePiece');
const router = express.Router();
const { validateDataDemande, validateDataDetailsDemande, validateDeleteDemande, checkValidationDemande } = require('../../middlewares/validators/pieces/validateDemandePiece');
const { validationDemandePiece } = require('../../models/gestionStocks/EtatStocks');

router.post('/', validateDataDemande, validateDataDetailsDemande, async (req, res) => {
    try {
        const demandePiece = new DemandePiece(req.body);
        await demandePiece.save();

        const detailsDemande = req.body.details;
        for(let i = 0; i < detailsDemande.length; i++) {
            detailsDemande[i].demandeId = demandePiece._id;
        }
        await DetailsDemandePiece.insertMany(detailsDemande);
        res.status(201).json(demandePiece);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.post('/validation/:demandeId', checkValidationDemande, async (req, res) => {
    try {
        const { demandeId } = req.params;
        const demande = await DemandePiece.findById(demandeId);

        if(!demande) {
            res.status(400).json({ message: "La demande n'existe pas"});
        }
        const detailsDemande = await DetailsDemandePiece.find({ demandeId });
        await Promise.all(detailsDemande.map(async (details) => {
            const data = {
                pieceId: details.pieceId,
                quantiteSortie: details.quantite,
                quantiteEntree: details.quantite,
            };
            await validationDemandePiece(data, demande.mecanicienId);
        }));

        await DetailsDemandePiece.updateMany(
            { demandeId: demandeId }, { $set: { status: 10 }}
        );
        await DemandePiece.updateOne(
            { _id: demandeId }, { $set: { status: 10 } }
        );
        res.json({ message: "Demande de pièce validée "});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/refus/:demandeId', checkValidationDemande, async (req, res) => {
    try {
        const { demandeId } = req.params;
        await DetailsDemandePiece.updateMany(
            { demandeId: demandeId }, { $set: { status: -10 }}
        );
        await DemandePiece.updateOne(
            { _id: demandeId }, { $set: { status: -10 }}
        );
        res.json({ message: "La demande de pièce a été rejetée"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:demandeId', validateDataDemande, async (req, res) => {
    try {
        const { demandeId } = req.params;
        const demande = await DemandePiece.findByIdAndUpdate(demandeId, req.body, { new: true });
        res.json(demande);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const demandes = await DemandePiece.find();
        res.json({ data: demandes });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:demandeId', async (req, res) => {
    try {
        const { demandeId } = req.params;
        const demande = await DemandePiece.findById(demandeId)
            .populate("mecanicienId");
        res.json({ data: demande });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:mecanicienId', async (req, res) => {
    try {
        const { mecanicienId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const demandes = await DemandePiece.find({ mecanicienId })
            .skip(skip).limit(limit);
        const countDemandes = await DemandePiece.countDocuments({ mecanicienId });

        res.json({
            data: demandes,
            count: countDemandes,
            currentPage: page,
            totalPages: Math.ceil(countDemandes / limit),
            totalItems: countDemandes,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const demandes = await DemandePiece.find()
            .populate("mecanicienId")
            .skip(skip).limit(limit);
        const countDemandes = await DemandePiece.countDocuments();

        res.json({
            data: demandes,
            count: countDemandes,
            currentPage: page,
            totalPages: Math.ceil(countDemandes / limit),
            totalItems: countDemandes,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.delete('/:demandeId', validateDeleteDemande, async (req, res) => {
    try {
        const { demandeId } = req.params;

        await DemandePiece.findByIdAndDelete(demandeId);
        await DetailsDemandePiece.deleteMany({ demandeId: demandeId });

        res.json({ message: "La demande de pièce indiquée a été supprimée"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;