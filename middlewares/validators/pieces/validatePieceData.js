const { body, validationResult } = require('express-validator');

const validateCategoriePiece = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('designationCategoriePiece').trim().notEmpty()
        .withMessage("Veuillez indiquer le nom de la catégorie de pièce"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

const validatePiece = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('nomPiece').trim().notEmpty()
        .withMessage('Veuillez indiquer le nom de la pièce'),
    body('categoriePieceId').trim().notEmpty()
        .withMessage('Veuillez indiquer la catégorie'),
    body('reference').trim().notEmpty()
        .withMessage('Veuillez indiquer la référence de la pièce'),
    body('seuilAlerte').trim().notEmpty()
        .withMessage('Veuillez indiquer le seuil d\'alerte pour le stock'),
    body('prixUnitaire').trim().notEmpty()
        .withMessage('Veuillez indiquer le prix unitaire de la pièce'),
    body('modelesCompatibles').notEmpty()
        .withMessage('Veuillez indiquez les modèles de voiture compatibles à la pièce'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateCategoriePiece = validateCategoriePiece;
exports.validatePiece = validatePiece;