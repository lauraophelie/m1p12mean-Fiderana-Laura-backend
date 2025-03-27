const express = require('express');
const RetourPiece = require('../../models/pieces/retour/RetourPiece');
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