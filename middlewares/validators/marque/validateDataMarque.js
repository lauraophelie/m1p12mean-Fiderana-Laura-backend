const { body, validationResult } = require('express-validator');

const validateMarque = [
    body('designationMarque').trim().notEmpty().withMessage('Veuillez indiquer le nom de la marque'),
    (req, res, next) => {
        console.log("middleware validation marque");
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateMarque = validateMarque;