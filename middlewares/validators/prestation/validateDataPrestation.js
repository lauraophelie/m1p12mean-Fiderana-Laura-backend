const { body, validationResult } = require('express-validator');

const validatePrestation = [
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

exports.validatePrestation = validatePrestation;