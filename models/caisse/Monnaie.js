const mongoose = require('mongoose');

const MonnaieSchema = new mongoose.Schema({
    nomMonnaie: {
        type: String,
        required: [true, "Veuillez spécifier le nom de la monnaie"]
    },
    codeISO: {
        type: String,
        required: [true, "Veuillez spécifier la version cours de la monnaie"]
    }
}, { timestamps: true });

const Monnaie = mongoose.model("Monnaie", MonnaieSchema);

module.exports = Monnaie;
