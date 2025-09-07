const mongoose = require('mongoose');

const AvisClientMecanicien = new mongoose.Schema({
    commentaireAvis: {
        type: String, 
        required: false
    },
    note: {
        type: Number,
        required: [true, "Veuillez indiquer la note que vous souhaitez laisser à ce mécanicien"],
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    mecanicienId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('AvisClientMecanicien', AvisClientMecanicien);
