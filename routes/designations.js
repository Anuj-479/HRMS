var express = require('express');
var router = express.Router();
const dbConnection = require('./../database/DBConnection');
const authHelper = require('./../helper/authHelper')
const loginController = require('./../controllers/loginController');
const designationsController = require('./../controllers/designationsController');


router.get('/', authHelper.isAuthenticated, async function(req, res, next) {
    res.render('designations', { title: 'Designations', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee });
})

router.post('/fetchDesignationsList', authHelper.isAuthenticated, designationsController.validateFetchDesignationRequest, designationsController.fetchDesignationsList)

router.post('/addEditDesignation',  authHelper.isAuthenticated, designationsController.validateAddEditDesignationRequest, designationsController.addEditDesignation)

router.post('/deleteDesignation',  authHelper.isAuthenticated, designationsController.validateDeleteDesignationRequest, designationsController.deleteDesignation)

module.exports = router;