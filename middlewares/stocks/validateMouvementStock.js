const { body, validationResult } = require('express-validator');
const { getQuantiteRestanteMecanicien } = require('../../models/gestionStocks/EtatStocks');

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

const checkQuantiteStockMecanicien = [
    async (req, res, next) => {
        const { pieceId, mecanicienId, quantiteSortie } = req.body;
        const quantiteRestante = await getQuantiteRestanteMecanicien(mecanicienId, pieceId);
        if(quantiteSortie <= 0) {
            return res.status(400).json({ message: "Quantité invalide. La quantité sortie doit être positive"});
        }
        if(quantiteSortie > quantiteRestante) {
            return res.status(400).json({ message: `
                Quantité invalide. 
                Quantité à sortir souhaitée : ${quantiteSortie} Quantité restante : ${quantiteRestante}
            `});
        }
        next();
    }
];

exports.validateSortieStockMecanicien = validateSortieStockMecanicien;
exports.checkQuantiteStockMecanicien = checkQuantiteStockMecanicien;