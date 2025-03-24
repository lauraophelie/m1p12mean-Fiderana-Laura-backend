const express = require('express');
const router = express.Router();

const Piece = require('../../models/pieces/Piece');
const { validatePiece } = require('../../middlewares/validators/pieces/validatePieceData');

router.post('/', validatePiece, async (req, res) => {
    try {
        const piece = new Piece(req.body);
        await piece.save();

        res.status(201).json(marque);
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
        const pieces = await Piece.find();
        res.json({ data: pieces });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;