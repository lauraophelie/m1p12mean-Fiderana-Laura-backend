const express = require('express');
const router = express.Router();
const Employe = require('../../models/Employe/Employe');
// Créer un employe
router.post('/', async (req, res) => {
 try {
 const employe = new Employe(req.body);
 employe.mdp=employe.prenom;
 await employe.save();
 res.status(201).json(employe);
 } catch (error) {
 res.status(400).json({ message: error.message });
 console.log(error)
 }
});
// Lire tous les employes
router.get('/', async (req, res) => {
 try {
 const employes = await Employe.find().populate("poste","nomPoste");
 res.json(employes);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});
// Mettre à jour un employe
router.put('/:id', async (req, res) => {
    try {
    const employe = await Employe.findByIdAndUpdate(req.params.id,
   req.body, { new: true });
    res.json(employe);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});
   // Supprimer un employe
router.delete('/:id', async (req, res) => {
    try {
    await Employe.findByIdAndDelete(req.params.id);
    res.json({ message: "Employe supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });

router.get('/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const employes = await Employe.find()
            .populate("poste")
            .skip(skip).limit(limit);
        const countEmployes = await Employe.countDocuments();

        res.json({
            data: employes,
            count: countEmployes,
            currentPage: page,
            totalPages: Math.ceil(countEmployes / limit),
            totalItems: countEmployes,
            itemsPerPage: limit
        });
    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const employe = await Employe.findById(req.params.id).populate("poste");
        if (!employe) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }
        res.json(employe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;