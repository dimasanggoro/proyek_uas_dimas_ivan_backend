const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const poolQuery = require('../database');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, passw } = req.body;

  try {
    // Check if the user exists
    const result = await poolQuery('SELECT * FROM login WHERE username = ?', [username]);
    if (result.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result[0];

    // Compare the hashed password with the provided password
    const passwordMatch = await bcrypt.compare(passw, user.passw);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ username }, 'BLABLA123', { expiresIn: '1h' });
    const mytoken = user.passw;

    res.json({ success: true, token, mytoken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
