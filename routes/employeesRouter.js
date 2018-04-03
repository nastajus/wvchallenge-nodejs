const express = require('express');
const models = require('./../models');

var router = express.Router();

router.get('/', (req, res, next) => {
	//models.Expense.
	res.send('works!!');
});

module.exports = router;