const express = require('express');
const router = express.Router();
const NotificationPerte = require('../../models/pieces/perte/NotificationPerte');

router.post('/', async (req, res) => {
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

router.get('/:perteId', async (req, res) => {
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