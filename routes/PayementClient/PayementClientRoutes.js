const express = require('express');
const router = express.Router();
const PayementClient = require('../../models/PayementClient/PayementClient');

const mongoose = require('mongoose');

// Route : GET /drop-index
router.get('/drop-index', async (req, res) => {
  try {
    // Connexion à la collection
    const collection = mongoose.connection.collection('payementclients');

    // Liste les index
    const indexesBefore = await collection.indexes();

    // Vérifie si l'index existe
    const hasIndex = indexesBefore.find(index => index.name === 'idClient_1');
    if (!hasIndex) {
      return res.status(200).json({ message: "L'index idClient_1 n'existe pas." });
    }

    // Supprime l'index
    await collection.dropIndex('idClient_1');

    const indexesAfter = await collection.indexes();
    res.status(200).json({
      message: "Index idClient_1 supprimé avec succès.",
      indexesAvant: indexesBefore,
      indexesApres: indexesAfter
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'index :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'index", details: error.message });
  }
});

// router.post('/', async (req, res) => {
//     try {
//         const payementClient = new PayementClient(req.body);
//         await payementClient.save();
//         res.status(201).json(payementClient);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });
// Lire tous les payementClient
router.get('/', async (req, res) => {
    try {
        // On utilise populate pour récupérer les informations du Client et du ModePayement
        const payements = await PayementClient.find()
            .populate('idClient')  // Peupler les données du client
            .populate('modePayement');  // Peupler les données du mode de payement
        
        // Vérification s'il y a des payements
        if (!payements || payements.length === 0) {
            return res.status(404).json({ message: 'Aucun payement client trouvé' });
        }

        // Renvoyer les payements trouvés
        res.status(200).json(payements);
    } catch (error) {
        // Gérer les erreurs
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
});

router.get('/:idClient', async (req, res) => {
  try {
      const { idClient } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const query = { idClient }; // On filtre par idClient
      

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const payements = await PayementClient.find(query)
          .populate('idClient')
          .populate('modePayement')
          .skip(skip)
          .limit(parseInt(limit));

      const totalCount = await PayementClient.countDocuments(query);

      if (!payements || payements.length === 0) {
          return res.status(404).json({ message: 'Aucun paiement trouvé' });
      }

      res.status(200).json({
          data: payements,
          count: totalCount,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          itemsPerPage: parseInt(limit)
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
});

router.post('/', (req, res) => {
    const { payementClient, confirmation ,idEmploye} = req.body;
  
    // Simule la récupération du reste à payer
    const reste = PayementClient.getResteDuClient(payementClient.idClient);
  
    if (payementClient.montant > reste && !confirmation) {
      //  Montant trop élevé, et pas encore confirmé
      return res.status(200).json({
        message: "Le montant est supérieur au reste dû. Voulez-vous continuer ?",
        requireConfirmation: true,
        difference: payementClient.montant - reste
      });
    }
  
    // Si confirmé OU montant valide
    PayementClient.insertionPayementClient(payementClient,idEmploye);
  
    res.status(200).json({
      message: "Paiement effectué avec succès",
      success: true
    });
  });

// Mettre à jour une payementClient
router.put('/:id', async (req, res) => {
    try {
        const payementClient = await PayementClient.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(payementClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Supprimer un PayementClient
router.delete('/:id', async (req, res) => {
    try {
        await PayementClient.findByIdAndDelete(req.params.id);
        res.json({ message: "PayementClient supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;