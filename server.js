const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerRouter = require('./register/registerRoute');
const loginRouter = require('./login/loginRoute');
const lapanganRouter = require('./lapangan/lapanganRoute');
const bookingRouter = require('./booking/bookingRoute');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/lapangan', lapanganRouter);
app.use('/booking', bookingRouter);


app.get('/', (req, res) => {
  res.status(403).send('Cannot direct access');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
