const { body, validationResult } = require('express-validator');

const validateMarque = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('designationMarque').trim().notEmpty().withMessage('Veuillez indiquer le nom de la marque'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateMarque = validateMarque;