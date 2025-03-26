const { body, validationResult } = require('express-validator');

const validateModele = [
    (req, res, next) => {
        if(!req.body) {
            return res.status(400).json({ message: 'Veuillez remplir les informations requises'})
        }
        next();
    },
    body('designationModele').trim().notEmpty().withMessage('Veuillez indiquer le nom du modèle'),
    body('marqueId').notEmpty().withMessage('Veuillez indiquer la marque correspondante à ce modèle'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateModele = validateModele;