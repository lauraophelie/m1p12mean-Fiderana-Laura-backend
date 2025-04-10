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
            remarques: req.body.remarques,
            images: imagePaths
        });
        await detailsVoiture.save();
        res.status(201).json(detailsVoiture);
    } catch(error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ message: 'Le fichier est trop volumineux. Taille maximale autorisée : 3 Mo.' });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/:voitureId', async (req, res) => {
    try {
        const { voitureId } = req.params;
        const details = await DetailsVoiture.findOne({ voitureId });
        res.json({ data: details });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;