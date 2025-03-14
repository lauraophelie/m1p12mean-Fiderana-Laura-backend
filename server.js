const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));