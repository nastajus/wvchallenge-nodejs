const express = require('express');
const articleRouter = require('./articleRouter');

var router = express.Router();

router.use('/article', articleRouter);

// router.get('/blah', (req... ) => {
//
// })

module.exports = router;