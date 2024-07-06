const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const poolQuery = require('../database'); // Adjust path as necessary

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, passw , email } = req.body;

  try {
    // Check if the user already exists
    const result = await poolQuery('SELECT * FROM login WHERE username = ?', [username]);
    if (result.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(passw, 10);

    // Insert the new user into the database
    await poolQuery('INSERT INTO login (username, email, passw) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    // Generate a token
    const token = jwt.sign({ username }, 'BLABLA123', { expiresIn: '1h' });

    //res.json({ success: true, token });
    res.json({ success: true });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
