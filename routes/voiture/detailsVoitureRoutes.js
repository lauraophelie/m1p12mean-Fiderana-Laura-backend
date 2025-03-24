const express = require('express');
const router = express.Router();
const upload = require('../../config/storage');
const DetailsVoiture = require('../../models/voiture/DetailsVoiture');

router.post('/:voitureId', upload.array('images', 5), async (req, res) => {
    try {
        const { voitureId } = req.params;
        const imagePaths = req.files.map(file => file.path);
        const detailsVoiture = new DetailsVoiture({
            voitureId: voitureId,
            remarques: body.remarques,
            images: imagePaths
        });
        await detailsVoiture.save();
        res.status(201).json(detailsVoiture);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;