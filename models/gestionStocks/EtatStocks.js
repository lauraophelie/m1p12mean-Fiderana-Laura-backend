const Piece = require('../pieces/Piece');
const MouvementStock = require('./MouvementStock');
const StockVirtuelMecanicien = require('./StockVirtuelMecanicien');

const sortieStock = async (data) => {
    try {
        const pieceFind = await Piece.findById(data.pieceId);
        if(!pieceFind) {
            throw new Error("La pièce indiquée n'existe pas");
        }
        const sortie = new MouvementStock({
            dateStock: new Date(),
            pieceId: data.pieceId,
            prixUnitaire: pieceFind.prixUnitaire,
            quantiteSortie: data.quantiteSortie
        });
        await sortie.save();
    } catch (error) {
        throw error;
    }
}

const entreeStockMecanicien = async(data, mecanicienId) => {
    try {
        const entree = new StockVirtuelMecanicien({
            dateStock: new Date(),
            pieceId: data.pieceId,
            quantiteEntree: data.quantiteEntree,
            mecanicienId: mecanicienId
        });
        await entree.save();
    } catch (error) {
        throw new Error(error);
    }
}

const validationDemandePiece = async (data, mecanicienId) => {
    try {
        await sortieStock(data);
        await entreeStockMecanicien(data, mecanicienId);
    } catch (error) {
        throw new Error(error);
    }
}

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

module.exports = { getEtatStocks, sortieStock, entreeStockMecanicien, validationDemandePiece };