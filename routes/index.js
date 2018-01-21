const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Quote = mongoose.model('quotes');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/showcase');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Quote.find({user: req.user.id})
    .then(quotes => {
      res.render('index/dashboard', {
        quotes
      });
  })
});

module.exports = router;