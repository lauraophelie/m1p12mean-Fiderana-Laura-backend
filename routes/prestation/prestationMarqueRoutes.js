const express = require('express');
const PrestationMarque = require('../../models/prestation/PrestationMarque');
const router = express.Router();
const { validatePrestationMarque, validateOnePrestationMarque } = require('../../middlewares/validators/prestation/validateDataPrestation'); 

const HistoriquePrestationMarque = require('../../models/prestation/HistoriquePrestationMarque');
const mongoose = require('mongoose');

router.post('/',  async (req, res) => {
    try {
        const prestationsMarque = await PrestationMarque.insertMany(req.body);
        res.status(201).json(prestationsMarque);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', validateOnePrestationMarque, async (req, res) => {
    try {
        const { id } = req.params;
        const getPrestationMarque = await PrestationMarque.findById(id);
        if (!getPrestationMarque) {
            return res.status(404).json({ message: "PrestationMarque non trouvé" });
        }
        const setHistorique = HistoriquePrestationMarque({
            prestationMarqueId: id,
            ancienTarif: getPrestationMarque.tarif,
            ancienneDureeEstimee: getPrestationMarque.dureeEstimee
        });
        await setHistorique.save();
        const prestationMarque = await PrestationMarque.findByIdAndUpdate(id, req.body, { new: true });
        res.json(prestationMarque);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const prestationsMarque = await PrestationMarque.find();
        res.json({ data : prestationsMarque });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const prestationMarque = await PrestationMarque.findById(id)
                                    .populate({ path: "prestationId", select: "nomPrestation" })
                                    .populate({ path: "modeleId", select: "designationModele" })
                                    .populate({ path: "marqueId", select: "designationMarque"});
        res.json({ data: prestationMarque });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;