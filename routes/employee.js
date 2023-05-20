var express = require('express');
var router = express.Router();
const dbConnection = require('./../database/DBConnection');
const authHelper = require('./../helper/authHelper')
const loginController = require('./../controllers/loginController');
const employeeController = require('./../controllers/employeeController');



router.get('/', authHelper.isAuthenticated, async function(req, res, next) {
    res.render('employee', { title: 'Employees', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee });
})

router.post('/fetchEmployeesList', authHelper.isAuthenticated, employeeController.validateFetchEmployeeRequest, employeeController.fetchEmployeesList)

router.post('/addEditEmployee', authHelper.isAuthenticated, employeeController.validateAddEditEmployeeRequest, employeeController.addEditEmployee)

module.exports = router;