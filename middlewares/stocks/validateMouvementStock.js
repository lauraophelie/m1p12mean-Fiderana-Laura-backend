const { body, validationResult } = require('express-validator');

const validateSortieStockMecanicien = [
    body('pieceId').trim().notEmpty()
        .withMessage("Veuillez indiquer la pièce concernée"),
    body('quantiteSortie').notEmpty()
        .withMessage("Veuillez indiquer la quantité à sortir"),
    body(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

exports.validateSortieStockMecanicien = validateSortieStockMecanicien;