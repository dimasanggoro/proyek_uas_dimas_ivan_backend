const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerRouter = require('./register/registerRoute');
const loginRouter = require('./login/loginRoute');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
  res.status(403).send('Cannot direct access');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
