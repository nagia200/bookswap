var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();

var Book = mongoose.model('Book');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var auth = jwt({secret: process.env.MEAN_STACK_SECRET, userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  Book.find(function(err, books) {
  if(err) { return next(err); }
  res.json(books);
  });
});

router.get('/books/:book', function(req, res, next) {
  req.book.populate('comments', function(err, book) {
    if(err) { return next(err); }
    res.json(book);
  });
});

router.post('/books', auth, function(req, res, next) {
  var book = new Book(req.body);
  book.save(function(err, book) {
    if(err) { return next(err); }
    res.json(book);
  });
});

/* Automatically retrieve book and comment objects. */
router.param('book', function(req, res, next, id) {
  var query = Book.findById(id);
  query.exec(function(err, book) {
    if(err) { return next(err); }
    if(!book) { return next(new Error('Can\'t find book.')); }

    req.book = book;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function(err, comment) {
    if(err) { return next(err); }
    if(!comment) { return next(new Error('Can\t find comment.')); }

    req.comment = comment;
    return next();
  });
});

router.get('/books/:book', function(req, res) {
  res.json(req.book);
});

/* PUT book favorites. */
router.put('/books/:book/favorite', auth, function(req, res, next) {
  req.book.favorite(function(err, book) {
    if(err) { return next(err); }
    res.json(book);
  });
});

/* POST comments. */
router.post('/books/:book/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.book = req.book;
  comment.author = req.payload.username;

  comment.save(function(err, comment) {
    if(err) { return next(err); }
    req.book.comments.push(comment);
    req.book.save(function(err,book) {
      if(err) { return next(err); }
      res.json(comment);
    });
  });
});

/* PUT comment favorites. */
router.put('/books/:book/comments/:comment/favorite', auth, function(req, res, next) {
  req.comment.favorite(function(err, comment) {
    if(err) { return next(err); }
    res.json(comment);
  });
});

/* DELETE books. */
router.delete('/books/:book', auth, function(req, res, next) {
  req.book.remove({ _id: req.book._id}, function(err, book) {
    if(err) { return next(err); }
    res.json({message: 'Deleted book'});
  });
});

/* Register user. */
router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields.'});
  }
  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if(err) { return next(err); }
    return res.json({token: user.generateJWT()})
    });
});

/* Login user. */
router.post('/login', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields.'});
  }
  passport.authenticate('local', function(err, user, info) {
    if(err) { return next(err); }
    if(user) {
      return res.json({ token: user.generateJWT()});
    }
    else {
      return res.status(404).json(info);
    }
  })(req, res, next);
});

module.exports = router;
