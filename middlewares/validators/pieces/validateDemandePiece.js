const { body, validationResult } = require('express-validator');
const DemandePiece = require('../../../models/pieces/demande/DemandePiece');

const validateDataDemande = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises pour la demande de pièce'})
        }
        next();
    },
    body("motifDemande").trim().notEmpty()
        .withMessage("Veuillez indiquer le motif de la demande"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const validateDataDetailsDemande = [
    (req, res, next) => {
        if (!req.body.details || !Array.isArray(req.body.details)) {
            return res.status(400).json({ message: 'Les détails de la demande de pièce sont requis' });
        }
        next();
    },
    body("details.*.pieceId").trim().notEmpty()
        .withMessage("Veuillez indiquer la pièce concernée"),
    body("details.*.quantite").notEmpty()
        .withMessage("Veuillez indiquer la quantité de pièce"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const validateDeleteDemande = [
    async (req, res, next) => {
        const { demandeId } = req.params;
        try {
            const demande = await DemandePiece.findById(demandeId);

            if(!demande) {
                return res.status(400).json({ message: "La demande indiquée n'existe pas"})
            }
            if(demande.status == 10) {
                return res.status(400).json({ message: "Vous ne pouvez plus supprimer cette demande"});
            }
            next();
        } catch (error) {
            return res.status(500).json({ message : error.message });
        }
    }
];

exports.validateDataDemande = validateDataDemande;
exports.validateDataDetailsDemande = validateDataDetailsDemande;
exports.validateDeleteDemande = validateDeleteDemande;