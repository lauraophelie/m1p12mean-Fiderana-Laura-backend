const express = require('express');
const router = express.Router();

const CategoriePiece = require('../../models/pieces/CategoriePiece');
const { validateCategoriePiece } = require('../../middlewares/validators/pieces/validatePieceData');

router.post('/', validateCategoriePiece, async (req, res) => {
    try {
        const categoriePiece = new CategoriePiece(req.body);
        await categoriePiece.save();
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
        const categoriesPieces = await CategoriePiece.find();
        res.json({ data: categoriesPieces });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.delete('/:categorieId', async (req, res) => {
    try {
        await CategoriePiece.findByIdAndDelete(req.params.categorieId);
        res.json({ message: "Catégorie de pièce supprimée "});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;