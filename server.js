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

app.use('/profils', require('./routes/profilRoutes')); 
app.use('/postes', require('./routes/posteRoutes')); 
app.use('/employes',validationToken, verifierRole ("Client","Admin"),require('./routes/employeRoutes')); 
app.use('/clients', require('./routes/clientRoutes')); 
app.use('/posteEmployes', require('./routes/posteEmployeRoutes')); 
app.use('/login', require('./routes/authentificationRoutes')); 

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));