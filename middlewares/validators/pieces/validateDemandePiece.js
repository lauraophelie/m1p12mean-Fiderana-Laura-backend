const { body, validationResult } = require('express-validator');

const validateDataDemande = [
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
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateDataDemande = validateDataDemande;
exports.validateDataDetailsDemande = validateDataDetailsDemande;