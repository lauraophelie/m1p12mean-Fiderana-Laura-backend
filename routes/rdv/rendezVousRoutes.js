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

// Route pour récupérer les rendez-vous d'un mécanicien spécifique
router.get('/mecanicien/:mecanicienId', async (req, res) => {
    const { mecanicienId } = req.params;

    try {
        const rdvs = await RendezVous.getRdvByMecanicienId(mecanicienId);
        res.status(200).json({ data: rdvs });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.patch('/assigner-mecanicien', async (req, res) => {
    const { rdvId, mecanicienId } = req.body;

    try {
        const rdvMisAJour = await RendezVous.updateRdvMeca(rdvId, mecanicienId);
        res.status(200).json({ message: "Rendez-vous mis à jour avec succès", data: rdvMisAJour });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/statusPaginate/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!status) {
            return res.status(400).json({ message: "Le statut est requis" });
        }

        const rdvs = await RendezVous.find({ status })
            .populate("clientId", "nomClient prenom") 
            .skip(skip)
            .limit(limit);

        const totalItems = await RendezVous.countDocuments({ status });

        if (rdvs.length === 0) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce statut" });
        }

        res.json({
            data: rdvs,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des RDVs par statut :", error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;  // Le statut passé en paramètre de requête
        if (status === undefined) {
            return res.status(400).json({ message: "Le statut est requis" });
        }

        // Appel à la méthode getRdvByStatus pour obtenir les RDV filtrés par statut
        const rdvs = await RendezVous.getRdvByStatus(status);
        
        if (rdvs.length === 0) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce statut" });
        }

        res.json({ data: rdvs });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const rdv = await RendezVous.findById(id)
            .populate({
                path: 'clientId',
                select: 'nom prenom'  // On prend juste le nom et prénom
            })
            .populate({
                path: 'voitureId',
                populate: [
                    { path: 'marqueId', select: 'designationMarque' },
                    { path: 'modeleId', select: 'designationModele' },
                    { path: 'categorieVoitureId', select: 'designationCategorie' },
                    { path: 'typeEnergieId', select: 'designationTypeEnergie' },
                    { path: 'boiteVitesseId', select: 'designationBoite' },
                    { path: 'clientId', select: 'nom prenom' } // si tu veux aussi les infos client dans voiture
                ],
                select: 'immatriculation marqueId modeleId categorieVoitureId typeEnergieId boiteVitesseId anneeFabrication'
            });

        if (!rdv) {
            return res.status(404).json({ message: 'Rendez-vous introuvable' });
        }

        res.status(200).json({ data: rdv });

    } catch (error) {
        console.error('Erreur lors de la récupération du rendez-vous :', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;