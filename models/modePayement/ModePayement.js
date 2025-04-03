const mongoose = require('mongoose');

const ModePayementSchema = new mongoose.Schema({
    designationModePayement: { 
        type: String, 
        required: [true, "La désignation du mode Payement est obligatoire"],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ModePayement', ModePayementSchema);