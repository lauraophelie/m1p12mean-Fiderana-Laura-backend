const express = require('express');
const router = express.Router();

router.get('/:demandeId', async (req, res) => {
    try {

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.get('/', async (req, res) => {
    try {

    } catch(error) {
        res.status(500).json({ message : error.message });
    }
});

router.delete('/:demandeId', async (req, res) => {

});

module.exports = router;