const express = require('express');
const poolQuery = require('../database');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

router.use(bodyParser.json());
router.use(cors());

// Get semua booking data
router.get('/', async (req, res) => {
    try {
        const result = await poolQuery('SELECT * FROM view_booking', []);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get booking spesifik by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await poolQuery('SELECT * FROM view_booking WHERE id_booking = ?', [id]);
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add Booking
router.post('/', async (req, res) => {
    const { id_login, id_lapangan } = req.body;
    if (!id_login || !id_lapangan) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
    }
    try {
        const result = await poolQuery('INSERT INTO booking (id_login, id_lapangan) VALUES (?, ?)', [id_login, id_lapangan]);
        res.status(201).json({ message: 'Booking berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        console.error('Error inserting into database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit Booking
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_login, id_lapangan } = req.body;

    if (!id_login || !id_lapangan) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    try {
        const result = await poolQuery('UPDATE booking SET id_login = ?, id_lapangan = ? WHERE id_booking = ?', [id_login, id_lapangan, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Booking berhasil diupdate' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error updating database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//delete booking
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await poolQuery('DELETE FROM booking WHERE id_booking = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Booking berhasil Di Hapus' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error updating database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;