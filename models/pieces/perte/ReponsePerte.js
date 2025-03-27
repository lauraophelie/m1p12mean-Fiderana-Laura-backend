const mongoose = require('mongoose');

const ReponsePerteSchema = new mongoose.Schema({
    dateReponse: {
        type: Date,
        required: true,
        default: Date.now
    },
    perteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NotificationPerte",
        required: true
    },
    motifRefus: {
        type: String,
        required: [true, "Veuillez indiquer la réponse"]
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ReponsePerte', ReponsePerteSchema);