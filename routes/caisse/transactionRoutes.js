const express = require('express');
const router = express.Router();
const TransactionCaisse = require('../../models/caisse/TransactionCaisse');

// Créer un transactionCaisse
router.post('/', async (req, res) => {
 try {
 const transactionCaisse = new TransactionCaisse(req.body);
 await transactionCaisse.save();
 res.status(201).json(transactionCaisse);
 } catch (error) {
 res.status(400).json({ message: error.message });
 }
});
// Lire tous les transactionsCaisse
router.get('/', async (req, res) => {
 try {
 const transactionsCaisse = await TransactionCaisse.find().populate({path:"idCaisse",select:"nomCaisse"}).populate({path:"employeResponsable",select:"nomEmploye prenom"});
 res.json(transactionsCaisse);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
});
// Mettre à jour un transactionCaisse
router.put('/:id', async (req, res) => {
    try {
    const transactionCaisse = await TransactionCaisse.findByIdAndUpdate(req.params.id,
   req.body, { new: true });
    res.json(transactionCaisse);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});
   // Supprimer un transactionCaisse
router.delete('/:id', async (req, res) => {
    try {
    await TransactionCaisse.findByIdAndDelete(req.params.id);
    res.json({ message: "TransactionCaisse supprimé" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
module.exports = router;