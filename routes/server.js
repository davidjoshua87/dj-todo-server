const express = require('express');
const router  = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Already Connect To Server' });
});

module.exports = router;