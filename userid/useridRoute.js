const express = require('express');
const poolQuery = require('../database');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

router.use(bodyParser.json());
router.use(cors());



// Get lapangan spesifik by username and email
router.post('/', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await poolQuery('SELECT * FROM login WHERE username = ?', [username]);
        if (result.length > 0) {
            res.status(200).json({ id_login: result[0].id_login });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;