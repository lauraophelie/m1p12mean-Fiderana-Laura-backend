const { body, validationResult } = require('express-validator');

const validateDataRdv = [
    body('dateRdv').trim().notEmpty()
        .withMessage("Veuillez indiquer la date du rendez-vous"),
    body('heureRdv').trim().notEmpty()
        .withMessage("Veuillez indiquer l'heure du rendez-vous"),
    body('voitureId')
        .withMessage("Veuillez indiquer la voiture pour le rendez-vous"),
    body('services')
        .withMessage("Veuillez indiquer le(s) service(s)"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateDataRdv = validateDataRdv;