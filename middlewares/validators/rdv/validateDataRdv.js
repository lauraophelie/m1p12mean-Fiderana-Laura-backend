const { body, validationResult } = require('express-validator');

const validateDataRdv = [
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateDataRdv = validateDataRdv;