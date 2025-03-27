const express = require('express');
const RetourPiece = require('../../models/pieces/retour/RetourPiece');
const { validationRetourPiece } = require('../../models/gestionStocks/EtatStocks');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const retourPiece = new RetourPiece(req.body);
        await retourPiece.save();

        res.status(201).json(retourPiece);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.post('/validation/:retourId', async (req, res) => {
    try {
        const { retourId } = req.params;
        const retour = await RetourPiece.findById(retourId);
        const data = {
            pieceId: retour.pieceId,
            quantiteSortie: retour.quantiteRetour,
            quantiteEntree: retour.quantiteRetour,
        };
        await validationRetourPiece(data, retour.mecanicienId);
        await RetourPiece.updateOne(
            { _id: retourId }, { $set: { status: 10 } }
        );
        res.json({ message: "Retour de pièce validé" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/refus/:retourId', async (req, res) => {
    try {
        const { retourId } = req.params;
        await RetourPiece.updateOne(
            { _id: retourId }, { $set: { status: -10 } }
        );
        res.json({ message: "Retour de pièce refusé" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:retourId', async (req, res) => {
    try {
        const { retourId } = req.params;
        const retour = await RetourPiece.findById(retourId)
            .populate({ path: "pieceId", select: "nomPiece reference"})
            .populate({ path: "mecanicienId", select: "nomEmploye prenom phone"});
        res.json({ data: retour });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const retours = await RetourPiece.find()
            .populate({ path: "pieceId", select: "nomPiece reference"})
            .populate({ path: "mecanicienId", select: "nomEmploye prenom phone"})
            .skip(skip).limit(limit);
        const countRetours = await RetourPiece.countDocuments();

        res.json({
            data: retours,
            count: countRetours,
            currentPage: page,
            totalPages: Math.ceil(countRetours / limit),
            totalItems: countRetours,
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

        const retours = await RetourPiece.find({ mecanicienId })
            .populate({ path: "pieceId", select: "nomPiece reference"})
            .skip(skip).limit(limit);
        const countRetours = await RetourPiece.countDocuments({ mecanicienId });

        res.json({
            data: retours,
            count: countRetours,
            currentPage: page,
            totalPages: Math.ceil(countRetours / limit),
            totalItems: countRetours,
            itemsPerPage: limit
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;