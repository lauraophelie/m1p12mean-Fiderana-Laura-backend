const express = require('express');
const router = express.Router();
const NotificationPerte = require('../../models/pieces/perte/NotificationPerte');
const { validationNotifPertePiece } = require('../../models/gestionStocks/EtatStocks');
const ReponsePerte = require('../../models/pieces/perte/ReponsePerte');
const { validateDataNotifPerte, checkStatusPerte, validateReponsePerte } = require('../../middlewares/validators/pieces/validateRetourPiece');

router.post('/', validateDataNotifPerte, async (req, res) => {
    try {
        const pertePiece = new NotificationPerte(req.body);
        await pertePiece.save();

        res.status(201).json(pertePiece);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.post('/validation/:perteId', checkStatusPerte, async (req, res) => {
    try {
        const { perteId } = req.params;
        const perte = await NotificationPerte.findById(perteId);
        const data = {
            pieceId: perte.pieceId,
            quantiteSortie: perte.quantitePerdue,
            quantiteEntree: perte.quantitePerdue,
        };
        await validationNotifPertePiece(data, perte.mecanicienId);
        await NotificationPerte.updateOne(
            { _id: perteId }, { $set: { status: 10 } }
        );
        res.json({ message: "Perte de pièce validée" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/refus/:perteId', checkStatusPerte, validateReponsePerte, async (req, res) => {
    try {
        const { perteId } = req.params;
        const reponsePerte = new ReponsePerte(req.body);

        await reponsePerte.save();
        await NotificationPerte.updateOne(
            { _id: perteId }, { $set: { status: -10 } }
        );
        res.json({ message: "Le perte de pièce a été refusée"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/details/:perteId', async (req, res) => {
    try {
        const { perteId } = req.params;
        const perte = await NotificationPerte.findById(perteId)
            .populate({ path: "pieceId", select: "nomPiece reference"})
            .populate({ path: "mecanicienId", select: "nomEmploye prenom phone"});
        res.json({ data: perte });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const pertes = await NotificationPerte.find()
            .populate({ path: "pieceId", select: "nomPiece reference"})
            .populate({ path: "mecanicienId", select: "nomEmploye prenom phone"})
            .skip(skip).limit(limit);
        const countPertes = await NotificationPerte.countDocuments();

        res.json({
            data: pertes,
            count: countPertes,
            currentPage: page,
            totalPages: Math.ceil(countPertes / limit),
            totalItems: countPertes,
            itemsPerPage: limit
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/meca/:mecanicienId', async (req, res) => {
    try {
        const { mecanicienId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const pertes = await NotificationPerte.find({ mecanicienId })
            .populate({ path: "pieceId", select: "nomPiece reference"})
            .populate({ path: "mecanicienId", select: "nomEmploye prenom phone"})
            .skip(skip).limit(limit);
        const countPertes = await NotificationPerte.countDocuments({ mecanicienId });

        res.json({
            data: pertes,
            count: countPertes,
            currentPage: page,
            totalPages: Math.ceil(countPertes / limit),
            totalItems: countPertes,
            itemsPerPage: limit
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;