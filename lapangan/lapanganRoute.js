const express = require('express');
const path = require('path');
const poolQuery = require('../database');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const router = express.Router();

router.use(bodyParser.json());
router.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images'); // specify the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // specify the file name
    }
});

const upload = multer({ storage: storage });

// Get semua lapangan
router.get('/', async (req, res) => {
    try {
        const result = await poolQuery('SELECT * FROM view_lapangan', []);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get lapangan spesifik by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await poolQuery('SELECT * FROM view_lapangan WHERE id_lapangan = ?', [id]);
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: 'Lapangan not found' });
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add Lapangan
router.post('/', upload.single('foto_lapangan'), async (req, res) => {
    const { id_tipe_lapangan, nama_lapangan } = req.body;
    //const foto_lapangan = req.file ? req.file.filename : null; //output public\images\thisfilename.PNG
    const foto_lapangan = req.file ? path.basename(req.file.path) : null;



    if (!id_tipe_lapangan || !nama_lapangan || !foto_lapangan) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    try {
        const result = await poolQuery('INSERT INTO lapangan (id_tipe_lapangan, nama_lapangan, foto_lapangan) VALUES (?, ?, ?)', [id_tipe_lapangan, nama_lapangan, foto_lapangan]);
        res.status(201).json({ message: 'Lapangan berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        console.error('Error inserting into database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit Lapangan
router.put('/:id', upload.single('foto_lapangan'), async (req, res) => {
    const { id } = req.params;
    const { id_tipe_lapangan, nama_lapangan } = req.body;
    const foto_lapangan = req.file ? path.basename(req.file.path) : null;

    if (!id_tipe_lapangan || !nama_lapangan) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    try {
        let query = 'UPDATE lapangan SET id_tipe_lapangan = ?, nama_lapangan = ?';
        let values = [id_tipe_lapangan, nama_lapangan];

        if (foto_lapangan) {
            query += ', foto_lapangan = ?';
            values.push(foto_lapangan);
        }

        query += ' WHERE id_lapangan = ?';
        values.push(id);

        const result = await poolQuery(query, values);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Lapangan berhasil diupdate' });
        } else {
            res.status(404).json({ message: 'Lapangan not found' });
        }
    } catch (error) {
        console.error('Error updating database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//delete lapangan
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await poolQuery('DELETE FROM lapangan WHERE id_lapangan = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Lapangan berhasil Di Hapus' });
        } else {
            res.status(404).json({ message: 'Lapangan not found' });
        }
    } catch (error) {
        console.error('Error updating database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;
