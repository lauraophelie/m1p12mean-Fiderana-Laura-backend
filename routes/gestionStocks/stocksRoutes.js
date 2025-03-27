const express = require('express');
const MouvementStock = require('../../models/gestionStocks/MouvementStock');
const { getEtatStocks, getEtatStocksMecanicien } = require('../../models/gestionStocks/EtatStocks');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const mouvement = new MouvementStock(req.body);
        await mouvement.save();

        res.status(201).json(mouvement)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/etat', async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.body;
        const etatStock = await getEtatStocks(dateDebut, dateFin);
        res.json({ 
            data: etatStock,
            dateDebut: dateDebut,
            dateFin: dateFin
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/stock/:mecanicienId', async (req, res) => {
    try {
        const { mecanicienId } = req.params;
        const stocks = await getEtatStocksMecanicien(mecanicienId);

        res.json({ data: stocks });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const mouvements = await MouvementStock.find();
        res.json({ data: mouvements });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
})

module.exports = router;