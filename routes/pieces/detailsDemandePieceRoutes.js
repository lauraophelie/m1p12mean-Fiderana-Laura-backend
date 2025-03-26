const express = require('express');
const DetailsDemandePiece = require('../../models/pieces/demande/DetailsDemandePiece');
const DemandePiece = require('../../models/pieces/demande/DemandePiece');
const router = express.Router();
const { validateDeleteDemande } = require('../../middlewares/validators/pieces/validateDemandePiece');

router.get('/:demandeId', async (req, res) => {
    try {
        const { demandeId } = req.params;
        const demande = await DetailsDemandePiece.find({ demandeId })
            .populate({ path: "pieceId", select: "_id nomPiece reference"});
        res.json({ data: demande });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const demandes = await DetailsDemandePiece.find();
        res.json({ data: demandes });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.delete('/:demandeId', validateDeleteDemande, async (req, res) => {
    try {
        const { demandeId } = req.params;
        await DetailsDemandePiece.deleteMany({ demandeId: demandeId });
        res.json({ message: "La détails de la demande de pièce indiquée a été supprimée"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;