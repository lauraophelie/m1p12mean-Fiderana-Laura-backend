const mongoose = require('mongoose');

const MarqueSchema = new mongoose.Schema({
    designationMarque: { 
        type: String, 
        required: [true, "La désignation de la marque est obligatoire"],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Marque', MarqueSchema);