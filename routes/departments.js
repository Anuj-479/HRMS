var express = require('express');
var router = express.Router();
const dbConnection = require('./../database/DBConnection');
const authHelper = require('./../helper/authHelper')
const loginController = require('./../controllers/loginController');
const departmentsController = require('./../controllers/departmentsController');


router.get('/', authHelper.isAuthenticated, async function(req, res, next) {
    res.render('departments', { title: 'Departments', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee  });
})

router.post('/fetchDepartmentsList', authHelper.isAuthenticated, departmentsController.validateFetchDepartmentsRequest, departmentsController.fetchDepartmentsList)

router.post('/addEditDepartment',  authHelper.isAuthenticated, departmentsController.validateAddEditDepartmentRequest, departmentsController.addEditDepartment)

router.post('/deleteDepartment',  authHelper.isAuthenticated, departmentsController.validateDeleteDepartmentRequest, departmentsController.deleteDepartment)

module.exports = router;