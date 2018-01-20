const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', (req, res) => {
  res.render('quotes/index');
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('quotes/add');
});

module.exports = router;