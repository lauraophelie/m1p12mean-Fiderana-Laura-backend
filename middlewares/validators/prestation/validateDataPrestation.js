const { body, validationResult } = require('express-validator');

const validatePrestation = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('nomPrestation').trim().notEmpty()
        .withMessage("Veuillez indiquer le nom de la prestation")
        .isLength({ min: 3 })
        .withMessage('Le nom de la prestation doit contenir au moins 3 caractères'),
    
    body('serviceId').notEmpty()
        .withMessage('Veuillez indiquer le service concerné'),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const validatePrestationMarque = [
    body('*.prestationId').notEmpty()
        .withMessage("La prestation concernée doit être indiquée"),
    
    body('*.marqueId').notEmpty()
        .withMessage("La marque de voiture concernée concernée doit être indiquée"),

    body('*.modeleId').notEmpty()
        .withMessage("Veuillez indiquez le modèle de voiture concerné"),
      
    body('*.tarif').notEmpty()
        .withMessage("Veuillez indiquer le tarif")
        .isDecimal({ min: 0 })
        .withMessage("La valeur du tarif ne doit pas être négative"),
    
    body('*.dureeEstimee').notEmpty()
        .withMessage("Veuillez indiquer la durée estimée")
        .isInt({ min: 0 })
        .withMessage("La valeur de la durée estimée ne doit pas être négative"),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const validateOnePrestationMarque = [
    body('prestationId').notEmpty()
        .withMessage("La prestation concernée doit être indiquée"),
    
    body('marqueId').notEmpty()
        .withMessage("La marque de voiture concernée concernée doit être indiquée"),
      
    body('tarif').notEmpty()
        .withMessage("Veuillez indiquer le tarif")
        .isDecimal({ min: 0 })
        .withMessage("La valeur du tarif ne doit pas être négative"),
    
    body('dureeEstimee').notEmpty()
        .withMessage("Veuillez indiquer la durée estimée")
        .isInt({ min: 0 })
        .withMessage("La valeur de la durée estimée ne doit pas être négative"),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validatePrestation = validatePrestation;
exports.validatePrestationMarque = validatePrestationMarque;
exports.validateOnePrestationMarque = validateOnePrestationMarque;