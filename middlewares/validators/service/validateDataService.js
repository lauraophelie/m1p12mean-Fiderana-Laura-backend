const { body, validationResult } = require('express-validator');

const validateService = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('nomService').trim().notEmpty()
        .withMessage("Veuillez indiquer le nom du service")
        .isLength({ min: 3 })
        .withMessage('Le nom du service doit contenir au moins 3 caractères'),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateService = validateService;