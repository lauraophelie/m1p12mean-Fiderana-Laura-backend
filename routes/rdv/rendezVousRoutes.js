const express = require('express');
const router = express.Router();
const { validateDataRdv } = require('../../middlewares/validators/rdv/validateDataRdv');
const RendezVous = require('../../models/rdv/RendezVous');
const ServicesRendezVous = require('../../models/rdv/ServicesRendezVous');

router.post('/', validateDataRdv, async (req, res) => {
    try {
        const rdv = new RendezVous(req.body);
        await rdv.save();

        const servicesRdv = req.body.services;
        const services = [];

        for(let i = 0; i < servicesRdv.length; i++) {
            const serviceRdv = new ServicesRendezVous({
                rendezVousId: rdv._id,
                serviceId: servicesRdv[i]
            });
            services.push(serviceRdv);
        }
        await ServicesRendezVous.insertMany(services);
        res.status(201).json(rdv);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/:rdvId', validateDataRdv, async (req, res) => {
    try {
        const { rdvId } = req.params;
        const rdv = await RendezVous.findByIdAndUpdate(rdvId, req.body, { new: true });
        res.json(rdv);
    } catch(error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ errors });
        }
        res.status(400).json({ message: error.message });
    }
});

router.put('/annulation/:rdvId', async (req, res) => {
    try {
        const { rdvId } = req.params;
        const annulation = await RendezVous.updateOne(
            { _id: rdvId }, { $set: { status: -10 } }
        );
        res.json(annulation);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const rdv = await RendezVous.find();
        res.json({ data: rdv });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:rdvId', async (req, res) => {
    try {
        const { rdvId } = req.params;
        const rdv = await RendezVous.findById(rdvId)
            populate({ 
                path: "voitureId", 
                select: "_id immatriculation marqueId modeleId categorieVoitureId",
                populate: [
                    { path: "marqueId", select: "designationMarque" },
                    { path: "modeleId", select: "designationModele" },
                    { path: "categorieVoitureId", select: "designationCategorie" }
                ]
            })
            .populate({ path: "clientId", select: "_id nomClient prenom phone mail"});
        res.json({ data: rdv });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const rdvs = await RendezVous.find()
            .populate("clientId")
            .skip(skip).limit(limit);
        const countRdvs = await RendezVous.countDocuments();

        res.json({
            data: rdvs,
            count: countRdvs,
            currentPage: page,
            totalPages: Math.ceil(countRdvs / limit),
            totalItems: countRdvs,
            itemsPerPage: limit
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/client/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const rdvs = await RendezVous.find({ clientId })
            .populate("clientId")
            .skip(skip).limit(limit);
        const countRdvs = await RendezVous.countDocuments({ clientId: clientId });

        res.json({
            data: rdvs,
            count: countRdvs,
            currentPage: page,
            totalPages: Math.ceil(countRdvs / limit),
            totalItems: countRdvs,
            itemsPerPage: limit
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

module.exports = router;