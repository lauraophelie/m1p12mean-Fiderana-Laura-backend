const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const validationToken = require('./middleware/AuthentificationMiddleWare');

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
app.use('/profils', require('./routes/profilRoutes')); 
app.use('/postes', require('./routes/posteRoutes')); 
app.use('/employes',validationToken, require('./routes/employeRoutes')); 
app.use('/clients', require('./routes/clientRoutes')); 
app.use('/posteEmployes', require('./routes/posteEmployeRoutes')); 
app.use('/login', require('./routes/authentificationRoutes')); 


app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));