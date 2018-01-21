const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Quote = mongoose.model('quotes');
const User = mongoose.model('users');

router.get('/', (req, res) => {
  Quote.find({ status: 'public' })
    .populate('user')
    .populate('comments.commentUser')
    .then(quotes => {
      res.render('quotes/index', {
        quotes
      });
    })
});

router.get('/show/:id', (req, res) => {
  Quote.findOne({
    _id: req.params.id,
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(quote => {
    res.render('quotes/show', {
      quote
    })
  })
});

router.get('/author/:author', (req, res) => {
  Quote.find({ author: req.params.author })
    .then(quotes => {
      res.render('quotes/index', {
        quotes
      });
    })
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('quotes/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Quote.findOne({
    _id: req.params.id,
  })
  .then(quote => {
    res.render('quotes/edit', {
      quote
    })
  })
});

router.put('/:id', (req, res) => {
  Quote.findOne({
    _id: req.params.id,
  })
  .then(quote => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    quote.author = req.body.author;
    quote.text = req.body.text;
    quote.authorImage = req.body.authorImage;
    quote.status = req.body.status;
    quote.allowComments = allowComments;

    quote.save()
      .then(quote => {
        res.redirect('/dashboard');
      });
  });
});

router.post('/', (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newQuote = {
    author: req.body.author,
    text: req.body.text,
    status: req.body.status,
    authorImage: req.body.authorImage,
    allowComments: allowComments,
    user: req.user.id
  }

  new Quote(newQuote)
    .save()
    .then(quote => {
      res.redirect(`/quotes/show/${quote.id}`);
    }) 
})

router.delete('/:id', (req, res) => {
  Quote.remove({ _id: req.params.id })
    .then(() => {
      res.redirect('/dashboard');
    });
});

router.post('/comment/:id', (req, res) => {
  Quote.findOne({
    _id: req.params.id
  })
  .then(quote => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    quote.comments.unshift(newComment);

    quote.save()
      .then(quote => {
        res.redirect(`/quotes/show/${quote.id}`);
      })
  });
})

module.exports = router;