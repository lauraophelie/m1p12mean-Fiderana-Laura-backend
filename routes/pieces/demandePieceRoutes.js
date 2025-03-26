const express = require('express');
const DemandePiece = require('../../models/pieces/demande/DemandePiece');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const demandePiece = new DemandePiece(req.body);
        await demandePiece.save();

        res.status(201).json(demandePiece);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/:demandeId', async (req, res) => {
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
        const demande = await DemandePiece.findById(demandeId);
        res.json({ data: demande });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:mecanicienId', async (req, res) => {
    try {

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.delete('/:demandeId', async (req, res) => {

});

module.exports = router;