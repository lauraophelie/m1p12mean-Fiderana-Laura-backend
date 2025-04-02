const Piece = require('../pieces/Piece');
const MouvementStock = require('./MouvementStock');
const StockVirtuelMecanicien = require('./StockVirtuelMecanicien');
const mongoose = require('mongoose');

// mouvements stocks principal 
const mouvementStockPrincipal = async (data, type) => {
    try {
        const pieceFind = await Piece.findById(data.pieceId);
        if(!pieceFind) {
            throw new Error("La pièce indiquée n'existe pas");
        }
        const stockData = {
            dateStock: new Date(),
            pieceId: data.pieceId,
            prixUnitaire: pieceFind.prixUnitaire
        };
        if (type === 'entree') stockData.quantiteEntree = data.quantiteEntree;
        else if (type === 'sortie') stockData.quantiteSortie = data.quantiteSortie;

        const mouvement = new MouvementStock(stockData);
        await mouvement.save();
    } catch (error) {
        throw error;
    }
}

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
};

// mouvements stocks mécanicien 
const mouvementStocksMecanicien = async (data, mecanicienId, type) => {
    try {
        const pieceFind = await Piece.findById(data.pieceId);
        if(!pieceFind) {
            throw new Error("La pièce indiquée n'existe pas");
        }
        const stockData = {
            dateStock: new Date(),
            pieceId: data.pieceId,
            mecanicienId: mecanicienId
        };
        if (type === 'entree') {
            stockData.quantiteEntree = data.quantiteEntree;
        } else if (type === 'sortie') {
            stockData.quantiteSortie = data.quantiteSortie;
        }
        const mouvement = new StockVirtuelMecanicien(stockData);
        await mouvement.save();
    } catch (error) {
        throw new Error(error);
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
};

// validations 
const validationDemandePiece = async (data, mecanicienId) => {
    try {
        await sortieStock(data);
        await entreeStockMecanicien(data, mecanicienId);
    } catch (error) {
        throw new Error(error);
    }
};

const validationRetourPiece = async (data, mecanicienId) => {
    try {
        await mouvementStocksMecanicien(data, mecanicienId, 'sortie');
        await mouvementStockPrincipal(data, 'sortie');
    } catch (error) {
        throw new Error(error);
    }
};

const validationNotifPertePiece = async (data, mecanicienId) => {
    try {
        await mouvementStocksMecanicien(data, mecanicienId, 'sortie');
    } catch (error) {
        throw new Error(error);
    }
}


// états de stocks 
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

const getEtatStocksMecanicien = async (mecanicienId) => {
    try {
        const listePieces = await StockVirtuelMecanicien.find({ mecanicienId }).distinct("pieceId");
        const resultatStock = await Promise.all(listePieces.map(async (pieceId) => {
            const mouvements = await StockVirtuelMecanicien.aggregate([
                {
                    $match: { pieceId: pieceId }
                },
                { 
                    $group: {
                        _id: null,
                        entree: { $sum: "$quantiteEntree" },
                        sortie: { $sum: "$quantiteSortie" }
                    }
                }
            ]);
            console.log(mouvements)

            const mouvement = mouvements[0] || { entree: 0, sortie: 0 };
            return {
                pieceId,
                quantiteEntree: mouvement.entree,
                quantiteSortie: mouvement.sortie,
                quantiteRestante: (mouvement.entree - mouvement.sortie)
            }
        }));
        const resultatFinal = await Piece.populate(resultatStock, {
            path: "pieceId",
            select: "nomPiece reference"
        });
        return resultatFinal;
    } catch (error) {
        throw error;
    }
};

const getQuantiteRestanteMecanicien = async (mecanicienId, pieceId) => {
    try {
        const result = await StockVirtuelMecanicien.aggregate([
            {
                $match: {
                    mecanicienId: new mongoose.Types.ObjectId(mecanicienId),
                    pieceId: new mongoose.Types.ObjectId(pieceId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalEntree: { $sum: "$quantiteEntree" },
                    totalSortie: { $sum: "$quantiteSortie" }
                }
            }
        ]);

        if (!result || result.length === 0) return 0;
        return result[0].totalEntree - result[0].totalSortie;
    } catch (error) {
        throw error;
    }
}

module.exports = { 
    getEtatStocks,
    getEtatStocksMecanicien,
    mouvementStockPrincipal,
    mouvementStocksMecanicien,
    sortieStock, 
    entreeStockMecanicien, 
    validationDemandePiece,
    validationRetourPiece,
    validationNotifPertePiece,
    getQuantiteRestanteMecanicien
};