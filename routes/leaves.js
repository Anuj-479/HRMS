var express = require('express');
var router = express.Router();
const dbConnection = require('./../database/DBConnection');
const authHelper = require('./../helper/authHelper')
const leaveController = require('./../controllers/leaveController');


router.get('/my-leaves', authHelper.isAuthenticated, async function(req, res, next) {
    res.render('my_leaves', { title: 'My Leaves', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee });
})

router.post('/fetchMyLeaves', authHelper.isAuthenticated, leaveController.validateFetchLeaveRequest, leaveController.fetchMyLeavesList)


router.get('/leave-requests', authHelper.isAuthenticated, async function(req, res, next) {
    res.render('leave_requests', { title: 'Leave Requests', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee });
})

router.post('/fetchLeaveRequests', authHelper.isAuthenticated, leaveController.validateFetchLeaveRequest, leaveController.fetchLeaveRequestsList)

router.post('/createLeaveRequests', authHelper.isAuthenticated, leaveController.validateCreateLeaveRequest, leaveController.createLeaveRequest)

router.post('/approveLeaveRequest', authHelper.isAuthenticated, leaveController.validateApproveLeaveRequest, leaveController.approveLeaveRequest)

router.post('/rejectLeaveRequest', authHelper.isAuthenticated, leaveController.validateRejectLeaveRequest, leaveController.rejectLeaveRequest)

module.exports = router;