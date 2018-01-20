const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');

require('./models/User');

require('./config/passport')(passport);

const index = require('./routes/index');
const auth = require('./routes/auth');
const quotes = require('./routes/quotes');

const keys = require('./config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.use(express.static('public'))
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

app.use('/', index);
app.use('/auth', auth);
app.use('/quotes', quotes);

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});