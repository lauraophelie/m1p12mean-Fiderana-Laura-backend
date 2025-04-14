const express = require('express');
const router = express.Router();
const Diagnostique = require('../../models/diagnostique/Diagnostique');
const rdv=require("../../models/rdv/RendezVous");
const prestationM=require("../../models/prestation/PrestationMarque");
const prestationParService=require("../../models/TravauxAFaire/PrestationParServiceValideParClient");
router.post('/', async (req, res) => {
    try {
        const diagnostique = new Diagnostique(req.body);
        await diagnostique.save();
        res.status(201).json(diagnostique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Lire tous les diagnostique
router.get('/', async (req, res) => {
    try {
        const diagnostique = await Diagnostique.find().populate({
            path: 'idRendezVous',
            select: 'dateRdv clientId',
            populate: {
                path: 'clientId', select: 'nomClient prenom'
            }
        });;
        res.json(diagnostique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Mettre à jour une diagnostique
router.put('/:id', async (req, res) => {
    try {
        const diagnostique = await Diagnostique.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(diagnostique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un diagnostique
router.delete('/:id', async (req, res) => {
    try {
        await Diagnostique.findByIdAndDelete(req.params.id);
        res.json({ message: "diagnostique supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/filtreParStatus', async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.body; 
        // const { status, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status !== undefined) {
            query.status = Number(status); // Convertir en nombre
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const diagnostics = await Diagnostique.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        const countDiagnostics = await Diagnostique.countDocuments(query);

        res.json({
            data: diagnostics,
            count: countDiagnostics,
            currentPage: parseInt(page),
            totalPages: Math.ceil(countDiagnostics / parseInt(limit)),
            totalItems: countDiagnostics,
            itemsPerPage: parseInt(limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/filtreParStatusEtClient', async (req, res) => {
    try {
        const { status, page = 1, limit = 10, idClient } = req.body;

        const query = {};
        if (status !== undefined) {
            query.status = Number(status);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Récupération des diagnostics avec le populate sur le rendez-vous
        const diagno = await Diagnostique.find(query)
            .populate({
                path: 'idRendezVous',
                populate: { path: 'clientId' } // on va jusqu'au client
            });

        // Filtrage manuel sur le client
        const filteredDiagnostics = diagno.filter(d => {
            return d.idRendezVous && d.idRendezVous.idClient && d.idRendezVous.idClient.toString() === idClient;
        });

        const paginatedDiagnostics = filteredDiagnostics.slice(skip, skip + parseInt(limit));

        res.json({
            data: paginatedDiagnostics,
            count: filteredDiagnostics.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredDiagnostics.length / parseInt(limit)),
            totalItems: filteredDiagnostics.length,
            itemsPerPage: parseInt(limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/diagnostiqueDetail', async (req, res) => {
    try {
        const { diagnostique, details } = req.body;

        // Vérification basique
        if (!diagnostique || !details ) {
            return res.status(400).json({ message: "Le diagnostique et les détails sont requis" });
        }

        // // Appel de la méthode statique
        const rdvDiagno=await rdv.avoirModeleVoiture(diagnostique.idRendezVous);
        const prestationMarques=await prestationM.getPrestationDetailsByModeleAndServices(rdvDiagno.voitureId.modeleId._id,details);
        // serviceAvecTarif
        const serviceTarif= await prestationM.getPrestationDetailsByMarqueAndServices(prestationMarques);
        const result = await Diagnostique.insererDiagnostiqueEtDetails(diagnostique, serviceTarif);
        const presta=prestationParService.insererPrestationParServiceValideParClient(prestationMarques,result.diagnostiqueId);

        // const pourcentage= await Diagnostique.calculerAvancePourDiagnostique(900000);
        // console.log(pourcentage+"result")
        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;