const { body, validationResult } = require('express-validator');

const validateCategoriePiece = [
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

exports.validateCategoriePiece = validateCategoriePiece;