var express = require('express');
var router = express.Router();
const dbConnection = require('./../database/DBConnection');
const authHelper = require('./../helper/authHelper')
const notificationsController = require('./../controllers/notificationsController');


router.get('/', authHelper.isAuthenticated, async function(req, res, next) {
    res.render('notifications', { title: 'Notifications', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee  });
})

router.post('/fetchNotificationsList', authHelper.isAuthenticated, notificationsController.validateFetchNotificationRequest, notificationsController.fetchNotificationList);

router.post('/addNotifications',  authHelper.isAuthenticated, notificationsController.validateAddNotificationsRequest, notificationsController.addNotification);


module.exports = router;