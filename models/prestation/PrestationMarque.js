const mongoose = require('mongoose');

const Prestation = require('../prestation/Prestation');
const Marque = require('../marque/Marque');
const Modele = require('../marque/Modele');

const PrestationMarqueSchema = new mongoose.Schema({
    prestationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prestation",
        required: [true, "Veuillez préciser la prestation concernée"]
    },
    modeleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Modele",
      required: [true, "Veuillez préciser le modèle de voiture concerné"]
    },
    marqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marque",
        required: [true, "Veuillez préciser la marque concernée"]
    },
    tarif: {
        type: Number,
        required: [true, "Veuillez préciser le tarif"],
        min: [0, "Le tarif ne peut pas être négatif"]
    },
    dureeEstimee: {
        type: Number,
        required: [true, "Veuillez préciser la durée estimée"],
        min: [0, "La durée estimée ne doit pas être négative"]
    }
}, { timestamps: true });

PrestationMarqueSchema.pre("save", async function (next) {
    const prestationExists = await Prestation.findById(this.prestationId);
    if(!prestationExists) {
        return next(new Error("Le prestation indiquée n'existe pas"));
    }

    const modeleExists = await Modele.findById(this.modeleId);
    if(!modeleExists) {
        return next(new Error("Le modèle de voiture indiqué n'existe pas"));
    }

    const marqueExists = await Marque.findById(this.marqueId);
    if (!marqueExists) {
        return next(new Error("La marque de voiture indiquée n'existe pas"));
    }
    next(); 
});

PrestationMarqueSchema.statics.getPrestationsByMarqueAndService = async (marqueId, serviceId) => {
    try {
        // Construire le filtre dynamiquement
        let filter = {};

        // Vérifier si un marqueId est fourni
        if (marqueId) {
            filter.marqueId = marqueId;
        }

        // Récupérer les prestations en fonction du serviceId
        let prestationsMarques = await PrestationMarque.find(filter)
            .populate({
                path: "prestationId",
                populate: { path: "serviceId", select: "nomService" } // Récupérer le service lié à la prestation
            })
            .populate("marqueId", "nomMarque"); // Récupérer le nom de la marque

        // Filtrer par serviceId si fourni
        if (serviceId) {
            prestationsMarques = prestationsMarques.filter(p => 
                p.prestationId.serviceId._id.toString() === serviceId
            );
        }

        return prestationsMarques;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des prestations : ${error.message}`);
    }
};


PrestationMarqueSchema.statics.getPrestationsByServiceForClient = async function (idDiagnostique) {
    try {
        if (!mongoose.Types.ObjectId.isValid(idDiagnostique)) {
            throw new Error("ID diagnostique invalide");
        }

        const results = await this.aggregate([
            // 1. Filtrer les détails de diagnostic avec status=10 et idDiagnostique
            {
              $match: {
                status: 10,
                idDiagnostique: mongoose.Types.ObjectId(idDiagnostique), // L'ID passé en argument
              },
            },
        
            // 2. Jointure avec le RendezVous pour accéder à la voiture (et son ID)
            {
              $lookup: {
                from: 'Rendezvous',
                localField: 'idDiagnostique',
                foreignField: 'idDiagnostique',
                as: 'rendezVous',
              },
            },
        
            // 3. Déplier le tableau des rendez-vous pour accéder à l'ID de la voiture
            {
              $unwind: '$rendezVous',
            },
        
            // 4. Jointure avec la voiture pour obtenir l'ID de la marque
            {
              $lookup: {
                from: 'Voiture',
                localField: 'rendezVous.voitureId',
                foreignField: '_id',
                as: 'voiture',
              },
            },
        
            // 5. Déplier le tableau de voiture pour obtenir l'ID de la marque
            {
              $unwind: '$voiture',
            },
        
            // 6. Jointure avec la prestation correspondant au service (en utilisant directement le service lié à l'idService)
            {
              $lookup: {
                from: 'Prestation',
                localField: 'idService', // Utilise directement idService pour obtenir les prestations
                foreignField: 'serviceId',
                as: 'prestation',
              },
            },
        
            // 7. Déplier la prestation pour l'avoir sous forme d'objet
            {
              $unwind: '$prestation',
            },
        
            // 8. Jointure avec la prestationMarque en fonction de la prestation
            {
              $lookup: {
                from: 'PrestationMarque',
                localField: 'prestation._id',
                foreignField: 'prestationId',
                as: 'prestationMarques',
              },
            },
        
            // 9. Déplier les prestationMarques pour les avoir sous forme d'objet
            {
              $unwind: '$prestationMarques',
            },
        
            // 10. Projeter uniquement idPrestationMarque et idDiagnostique
            {
              $project: {
                idPrestationMarque: '$prestationMarques._id',  // Récupère l'id de prestationMarque
              },
            },
          ]);
        
          return results;
    } catch (error) {
        console.error("Erreur lors de la récupération des prestations:", error);
        throw error;
    }
};

module.exports = mongoose.model('PrestationMarque', PrestationMarqueSchema);