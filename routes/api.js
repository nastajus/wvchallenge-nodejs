const express         = require('express');
const employeesRouter = require('./employees');
const expensesRouter  = require('./expenses');
const fileRouter      = require('./file');

const router = express.Router();

router.use('/employees', employeesRouter);
router.use('/expenses', expensesRouter);
router.use('/file', fileRouter);


router.get('/', (req, res) => {
	res.render('api.ejs');
});

module.exports = router;