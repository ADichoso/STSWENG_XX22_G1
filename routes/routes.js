// import module `express`
const express = require('express');

const controller = require('../controllers/controller.js')

const loginController = require('../controllers/loginController.js');

const profileController = require('../controllers/profileController.js');

const signupController = require('../controllers/signupController.js');

const reservationController = require('../controllers/reservationController.js');

const searchController = require('../controllers/searchController.js');

const securityController = require('../controllers/securityController.js');

const forgotPassController = require('../controllers/forgotPassController.js');

const scheduleController = require('../controllers/scheduleController.js');

const validation = require('../helpers/validations.js');

const multer = require('multer');
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'public/images/profilepictures')
  },

  filename: (req, file, cb) => {
    cb(null, req.body.idNumber + '.png')
  }

})

const upload = multer({storage: storage})

const app = express();


// Index / Database settings
app.get('/', controller.getIndex);

// Error page
app.get('/Error', controller.getError);

// Login settings
app.get('/Login', loginController.getLogin);
app.post('/Login', loginController.postLogin);

// Forgot Password settings
app.get('/ForgotPassword', forgotPassController.getForgotPassword);
app.post('/ForgotPassword', forgotPassController.postForgotPassword);
app.post('/ChangeFPassword', forgotPassController.postChangeFPassword);

// Signup settings
app.get('/SignUp', signupController.getSignUp);
app.post('/SignUp', validation.signupValidation(), signupController.postSignUp);
app.get('/getCheckID', signupController.getCheckID);
app.get('/getCheckEmail', signupController.getCheckEmail);

// Security settings
app.get('/SecurityCheck', securityController.getSecurity);
app.post('/SecurityCheck', securityController.postSecurity);

// Search settings
app.get('/Search', searchController.getSearch);
app.post('/UserSearch', searchController.postUserSearch);
app.get('/SearchProfile', searchController.getSearchProfile);
app.get('/SearchReservation', searchController.getSearchReservation);

// User profile settings
app.get('/Profile', validation.securityCodeValidation, profileController.getProfile);

// Admin profile settings
app.get('/ProfileAdmin', validation.securityCodeValidation, profileController.getProfileAdmin);

app.get('/Logout', validation.securityCodeValidation, profileController.getLogout);

// Profile settings
app.get('/Settings', validation.securityCodeValidation, controller.getSettings);
app.post('/ChangePublicInfo', validation.securityCodeValidation, upload.single("dp"), profileController.postChangePublicInfo);
app.post('/ChangePrivateInfo', validation.securityCodeValidation, profileController.postChangePrivateInfo);
app.post('/ChangePassword', validation.securityCodeValidation, profileController.postChangePassword);
app.post('/DeleteAccount', validation.securityCodeValidation, profileController.postDeleteAccount);
app.post('/ChangeCode', validation.securityCodeValidation, profileController.postChangeCode);

// Schedule
app.get('/Schedule', validation.securityCodeValidation, controller.getSchedule);
app.get('/Schedule/:date/:location/:time', validation.securityCodeValidation, scheduleController.getReservations);

// Reservation
app.get('/Reservation', validation.securityCodeValidation, reservationController.getReservations);
app.post('/Reservation', validation.securityCodeValidation, reservationController.postReservations);
//Reservation Update and DeleteAccount
app.post('/ReservationUpdate', validation.securityCodeValidation, reservationController.postUpdateReservations);
app.post('/ReservationDelete', validation.securityCodeValidation, reservationController.postDelete);

// Admin Reservation
app.get('/ReservationAdmin', validation.securityCodeValidation, reservationController.getReservationAdmin);
app.get('/SearchUser', validation.securityCodeValidation, reservationController.getSearchUser)
app.post('/SearchUser', validation.securityCodeValidation, reservationController.postSearchUser);
// Admin Reservation Update and Delete
app.post('/SearchUserUpdate', validation.securityCodeValidation, reservationController.postSearchUserUpdate);
app.post('/SearchUserDelete', validation.securityCodeValidation, reservationController.postSearchUserDelete);

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = app;