const express = require('express');
const poolQuery = require('../database');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

router.use(bodyParser.json());
router.use(cors());

// Get semua tipe-lapangan
router.get('/', async (req, res) => {
    try {
        const result = await poolQuery('SELECT * FROM tipe_lapangan', []);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;