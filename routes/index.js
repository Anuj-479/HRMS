var express = require('express');
var router = express.Router();
const authHelper = require('./../helper/authHelper')
const dbConnection = require('./../database/DBConnection');
const loginController = require('./../controllers/loginController');




router.get('/logout', function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  console.log("logout");
  req.session.user = null
  req.session.person = null
  req.session.employee = null
  req.session.destroy();
  res.redirect('/login')
  // req.session.save(function (err) {
  //   if (err) next(err)

  //   // regenerate the session, which is good practice to help
  //   // guard against forms of session fixation
  //   req.session.regenerate(function (err) {
  //     if (err) next(err)
  //     res.redirect('/login')
  //   })
  // })
})

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('/login')
});

router.get('/login', async function(req, res, next) {
  res.render('login');
});

router.get('/dashboard', authHelper.isAuthenticated, async function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard', userDetails: req.session.user, personDetails: req.session.person, employeeDetails: req.session.employee });
});

router.post('/login', loginController.validateLoginRequest, loginController.login)

module.exports = router;
