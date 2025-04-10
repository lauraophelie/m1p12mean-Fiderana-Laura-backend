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

PrestationMarqueSchema.index({ prestationId: 1, modeleId: 1, marqueId: 1 }, { unique: true });

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

PrestationMarqueSchema.statics.getPrestationDetailsByModeleAndServices = async function(idModele, services) {
  const idServiceList = services.map(s => s.idService);

  return this.find({ modeleId: idModele })
      .populate({
          path: 'prestationId',
          match: { serviceId: { $in: idServiceList } },
          populate: { path: 'serviceId' }
      })
      .then(result => result.filter(pm => pm.prestationId !== null)); 
};

PrestationMarqueSchema.statics.getPrestationDetailsByMarqueAndServices = async function avoirTarifService(prestationsMarque) {
  const tarifParService = {};
  for (const pm of prestationsMarque) {
      const idService = pm.prestationId?.serviceId?._id.toString();
      const tarif = pm.tarif || 0;

      if (!idService) continue;

      if (!tarifParService[idService]) {
          tarifParService[idService] = 0;
      }

      tarifParService[idService] += tarif;
  }

  // Convertir en tableau d'objets
  return Object.entries(tarifParService).map(([idService, tarifTotal]) => ({
      idService,
      tarifTotal
  }));
}



module.exports = mongoose.model('PrestationMarque', PrestationMarqueSchema);