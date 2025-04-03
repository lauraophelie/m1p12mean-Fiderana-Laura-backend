const mongoose = require('mongoose');
const Service = require('../service/Service');

const PrestationSchema = new mongoose.Schema({
    nomPrestation: {
        type: String,
        required: [true, "Le nom de la prestation est obligatoire"]
    },
    descriptionPrestation: {
        type: String,
        required: false
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: [true, "Le service est obligatoire"]
    }
}, { timestamps: true });

PrestationSchema.pre("save", async function (next) {
    const serviceExists = await Service.findById(this.serviceId);
    if (!serviceExists) {
        return next(new Error("Le service indiqué n'existe pas"));
    }
    next();
});

module.exports = mongoose.model('Prestation', PrestationSchema);