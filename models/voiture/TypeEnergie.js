const mongoose = require('mongoose');

const TypeEnergieSchema = new mongoose.Schema({
    designationTypeEnergie: {
        type: String,
        required: [true, "La désignation est obligatoire"],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('TypeEnergie', TypeEnergieSchema);