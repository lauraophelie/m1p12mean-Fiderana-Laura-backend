const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { validationToken, verifierRole } = require('./middleware/AuthentificationMiddleWare');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

// upload images
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/marques', require('./routes/marque/marqueRoutes'));
app.use('/api/modeles', require('./routes/modele/modeleRoutes'));
app.use('/api/services', require('./routes/service/serviceRoutes'));
app.use('/api/prestations', require('./routes/prestation/prestationRoutes'));
app.use('/api/prestationsMarque', require('./routes/prestation/prestationMarqueRoutes'));
app.use('/api/pieces', require('./routes/pieces/pieceRoutes'));
app.use('/api/categoriePiece', require('./routes/pieces/categoriePieceRoutes'));
app.use('/api/voiture', require('./routes/voiture/voitureRoutes'));
app.use('/api/elementsVoiture', require('./routes/voiture/elementsVoiture'));
app.use('/api/detailsVoiture', require('./routes/voiture/detailsVoitureRoutes'));
app.use('/api/rendezVous', require('./routes/rdv/rendezVousRoutes'));
app.use('/api/rendezVousServices', require('./routes/rdv/rendezVousServicesRoutes'));
app.use('/api/demandePiece', require('./routes/pieces/demandePieceRoutes'));
app.use('/api/demandePieceDetails', require('./routes/pieces/detailsDemandePieceRoutes'));
app.use('/api/stocks', require('./routes/gestionStocks/stocksRoutes'));
app.use('/api/piece/retour', require('./routes/pieces/retourPieceRoutes'));
app.use('/api/piece/perte', require('./routes/pieces/pertePieceRoutes'));
app.use('/api/devis', require('./routes/devis/devisRoutes'));
app.use('/api/remarqueDevis', require('./routes/devis/remarqueDevisRoutes'));

app.use('/profils', require('./routes/profilRoutes')); 
app.use('/postes', require('./routes/posteRoutes')); 
// app.use('/employes',validationToken, verifierRole ("Client","Admin"),require('./routes/employeRoutes')); 
app.use('/employes',require('./routes/employeRoutes')); 
app.use('/clients', require('./routes/clientRoutes')); 
app.use('/posteEmployes', require('./routes/posteEmployeRoutes')); 
app.use('/login', require('./routes/authentificationRoutes')); 
app.use('/clients/payement', require('./routes/PayementClient/PayementClientRoutes')); 
app.use('/modePayement', require('./routes/modePayement/modePayementRoutes')); 
app.use('/caisse', require('./routes/caisse/caisseRoutes')); 
app.use('/monnaie', require('./routes/caisse/monnaieRoutes')); 
app.use('/caisse/transaction', require('./routes/caisse/transactionRoutes'));
app.use('/clients/montantServiceClient', require('./routes/clientService/montantServiceClientRoutes')); 
app.use('/clients/payement', require('./routes/PayementClient/PayementClientRoutes')); 
app.use('/diagnostique', require('./routes/diagnostique/DiagnostiqueRoutes')); 
app.use('/detailDiagnostique', require('./routes/diagnostique/DetailDiagnostiqueRoutes')); 
app.use('/prestationParService', require('./routes/travauxAFaire/PrestationParServiceParClientRoutes')); 




app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));