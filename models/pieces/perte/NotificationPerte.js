const mongoose = require('mongoose');

const NotificationPerteSchema = new mongoose.Schema({
    datePerte: {
        type: Date,
        required: [true, "La date de la perte est obligatoire"]
    },
    explicationPerte: {
        type: String,
        required: [true, "Le motif de la perte est obligatoire"]
    },
    mecanicienId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: true
    },
    pieceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece",
        required: [true, "Veuillez indiquer la pièce concernée"]
    },
    quantitePerdue: {
        type: Number,
        required: [true, "La quantité perdue doit être indiquée"],
        min: [0, "La quantité ne doit pas être négative"]
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('NotificationPerte', NotificationPerteSchema);