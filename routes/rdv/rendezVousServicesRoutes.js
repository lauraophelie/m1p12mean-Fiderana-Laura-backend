const express = require('express');
const ServicesRendezVous = require('../../models/rdv/ServicesRendezVous');
const router = express.Router();

router.get('/:rdvId', async (req, res) => {
    try {
        const { rdvId } = req.params;
        const services = await ServicesRendezVous.find({ rdvId })
            .populate({ path: "serviceId", select: "nomService descriptionService"})

        res.json({ data: services });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const services = await ServicesRendezVous.find();
        res.json({ data: services });
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await ServicesRendezVous.findByIdAndDelete(req.params.id);
        res.json({ message: "Service supprimé du rendez-vous"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;