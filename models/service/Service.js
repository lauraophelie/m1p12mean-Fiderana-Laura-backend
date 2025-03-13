const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    nomService: {
        type: String,
        required: [true, "Le nom du service est obligatoire"]
    },
    descriptionService: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);