const express = require('express');
const employeesRouter = require('./employeesRouter');

var router = express.Router();

router.use('/employees', employeesRouter);

// router.get('/blah', (req... ) => {
//
// })

module.exports = router;