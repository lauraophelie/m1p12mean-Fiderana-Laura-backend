const mongoose = require('mongoose');

const congeEmployeSchema = new mongoose.Schema({
  idEmploye: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employe',
    required: true
  },
  mois: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  annee: {
    type: Number,
    required: true
  },
  resteConge: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CongeEmploye', congeEmployeSchema);
