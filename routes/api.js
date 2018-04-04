const express         = require('express');
const employeesRouter = require('./employees');
const expensesRouter  = require('./expenses');

const router = express.Router();

router.use('/employees', employeesRouter);
router.use('/expenses', expensesRouter);


router.get('/', (req, res, next) => {
	res.render('api.ejs');
});

module.exports = router;