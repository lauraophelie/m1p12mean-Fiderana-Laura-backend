const { body, validationResult } = require('express-validator');
const RetourPiece = require('../../../models/pieces/retour/RetourPiece');
const NotificationPerte = require('../../../models/pieces/perte/NotificationPerte');

const validateDataRetourPiece = [
    body('pieceId').trim().notEmpty()
        .withMessage("Veuillez indiquer la pièce que vous souhaitez retourner"),
    body('quantiteRetour').notEmpty()
        .withMessage("Veuillez indiquer la quantité que vous souhaitez retourner"),
    body('motifRetour').trim().notEmpty()
        .withMessage("Veuillez indiquer le motif de retour"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const checkValidationRetourPiece = [
    async (req, res, next) => {
        try {
            const { retourId } = req.params;
            const retour = await RetourPiece.findById(retourId);

            if(!retour) {
                return res.status(400).json({ message: "Le retour indiqué n'existe pas"});
            }
            if(retour.status == 10) {
                return res.status(400).json({ message: "Le retour de pièce a déjà été validé"});
            }
            next();
        } catch (error) {
            return res.status(500).json({ message : error.message });
        }
    }
];

const validateDataNotifPerte = [
    body('datePerte').trim().notEmpty()
        .withMessage('Veuillez indiquer la date de la perte'),
    body('explicationPerte').trim().notEmpty()
        .withMessage('Veuillez fournir une explication pour la perte'),
    body('pieceId').notEmpty()
        .withMessage('Veuillez indiquer la pièce qui a été perdue'),
    body('quantitePerdue').notEmpty()
        .withMessage('Veuillez indiquer la quantité perdue'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const checkStatusPerte = [
    async (req, res, next) => {
        try {
            const { perteId } = req.params;
            const perte = await NotificationPerte.findById(perteId);

            if(!perte) {
                return res.status(400).json({ message: "La notification de perte indiquée est introuvable" });
            }
            if(perte.status == 10) {
                return res.status(400).json({ message: "La notification de perte a déjà été validée"});
            }
            next();
        } catch (error) {
            return res.status(500).json({ message : error.message });
        }
    }
];

const validateReponsePerte = [
    body('motifRefus').trim().notEmpty()
        .withMessage('Veuillez remplir le motif'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateDataRetourPiece = validateDataRetourPiece;
exports.checkValidationRetourPiece = checkValidationRetourPiece;
exports.validateDataNotifPerte = validateDataNotifPerte;
exports.checkStatusPerte = checkStatusPerte;
exports.validateReponsePerte = validateReponsePerte;