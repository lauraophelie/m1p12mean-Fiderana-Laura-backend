const { body, validationResult } = require('express-validator');

const validateVoiture = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('immatriculation').trim().notEmpty()
        .withMessage("Veuillez indiquer le numéro d'immatriculation"),
    body('marqueId').trim().notEmpty()
        .withMessage("Veuillez indiquer la marque de la voiture"),
    body('modeleId').trim().notEmpty()
        .withMessage("Veuillez indiquer le modèle de la voiture"),
    body('categorieVoitureId').trim().notEmpty()
        .withMessage("Veuillez indiquer la catégorie de la voiture"),
    body('typeEnergieId').trim().notEmpty()
        .withMessage("Veuillez indiquer le type d'énergie de la voiture"),
    body('boiteVitesseId').trim().notEmpty()
        .withMessage("Veuillez indiquer le type de vitesse de la voiture"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateVoiture = validateVoiture;