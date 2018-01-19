const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

require('./config/passport')(passport);

const auth = require('./routes/auth');

const app = express();

app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.get('/', (req, res) => {
  res.send('it works');
});