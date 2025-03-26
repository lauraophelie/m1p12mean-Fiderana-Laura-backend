const Piece = require('../pieces/Piece');
const MouvementStock = require('./MouvementStock');

const getEtatStocks = async (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    const piecesAvecMouvements = await MouvementStock.distinct("pieceId", {
        dateStock: { $lte: fin }
    });

    const resultatEtat = await Promise.all(piecesAvecMouvements.map(async (pieceId) => {
        const stockInitial = await MouvementStock.aggregate([
            {
                $match: {
                    pieceId: pieceId,
                    dateStock: { $lt: debut }
                }
            },
            {
                $group: {
                    _id: null,
                    entree: { $sum: "$quantiteEntree" },
                    sortie: { $sum: "$quantiteSortie" }
                }
            }
        ]);
        const mouvements = await MouvementStock.aggregate([
            {
                $match: {
                    pieceId: pieceId,
                    dateStock: { $gte: debut, $lte: fin }
                }
            },
            {
                $group: {
                    _id: null,
                    entree: { $sum: "$quantiteEntree" },
                    sortie: { $sum: "$quantiteSortie" }
                }
            }
        ]);

        const initial = stockInitial[0] || { entree: 0, sortie: 0 };
        const mouvement = mouvements[0] || { entree: 0, sortie: 0 };

        return {
            pieceId,
            quantiteInitiale: initial.entree - initial.sortie,
            quantiteEntree: mouvement.entree,
            quantiteSortie: mouvement.sortie,
            quantiteRestante: (initial.entree - initial.sortie) + (mouvement.entree - mouvement.sortie)
        };
    }));
    const resultatFinal = await Piece.populate(resultatEtat, {
        path: "pieceId",
        select: "nomPiece reference"
    });
    return resultatFinal;
};

module.exports = { getEtatStocks };