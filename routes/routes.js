// import module `express`
const express = require('express');

const controller = require('../controllers/controller.js')

const edit_controller = require('../controllers/editDriverController.js');

const login_controller = require('../controllers/loginController.js');

const profile_controller = require('../controllers/profileController.js');

const signup_controller = require('../controllers/signupController.js');

const rsrv_controller = require('../controllers/reservationController.js');

const search_controller = require('../controllers/searchController.js');

const security_controller = require('../controllers/securityController.js');

const forgot_pass_controller = require('../controllers/forgotPassController.js');

const schedule_controller = require('../controllers/scheduleController.js');

const validation = require('../helpers/validations.js');

const path = require("path");

const pfp_path = path.join(__dirname, '..', '/public/profilepictures')
console.log(pfp_path)

const multer = require('multer');
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "./public/images/profilepictures")
  },

  filename: (req, file, cb) => {
    cb(null, req.body.id_number + '.png')
  }

})

const upload = multer({storage: storage})

const app = express();


// Index / Database settings
app.get('/', controller.get_index);

// Error page
app.get('/Error', controller.get_error);

// Login settings
app.get('/Login', login_controller.get_login);
app.post('/Login', login_controller.post_login);

// Forgot Password settings
app.get('/ForgotPassword', forgot_pass_controller.get_forgot_password);
app.post('/ForgotPassword', forgot_pass_controller.post_forgot_password);
app.post('/ChangeFPassword', forgot_pass_controller.post_change_F_password);

// Signup settings
app.get('/SignUp', signup_controller.get_signup);
app.post('/SignUp', validation.signup_validation(), signup_controller.post_signup);
app.get('/getCheckID', signup_controller.get_check_ID);
app.get('/getCheckEmail', signup_controller.get_check_email);

// Security settings
app.get('/SecurityCheck', security_controller.get_security);
app.post('/SecurityCheck', security_controller.post_security);

// Search settings
app.get('/Search', search_controller.get_search);
app.post('/UserSearch', search_controller.post_user_search);
app.get('/SearchProfile', search_controller.get_search_profile);
app.get('/SearchReservation', search_controller.get_search_reservation);

// User profile settings
app.get('/Profile', validation.security_code_validation, profile_controller.get_profile);

// Admin profile settings
app.get('/ProfileAdmin', validation.security_code_validation, profile_controller.get_profile_admin);

// Driver profile settings
app.get('/ProfileDriver', validation.security_code_validation, profile_controller.get_profile_driver);

app.get('/Logout', validation.security_code_validation, profile_controller.get_logout);

// Profile settings
app.get('/Settings', validation.security_code_validation, controller.get_settings);
//app.post('/ChangePublicInfo', profile_controller.post_change_public_info);
app.post('/ChangePublicInfo', validation.security_code_validation, profile_controller.post_change_public_info);
app.post('/ChangeDisplayPicture', validation.security_code_validation, upload.single("dp"), profile_controller.post_change_profile_picture);
app.post('/ChangePrivateInfo', validation.security_code_validation, profile_controller.post_change_private_info);
app.post('/ChangePassword', validation.security_code_validation, profile_controller.post_change_password);
app.post('/DeleteAccount', validation.security_code_validation, profile_controller.post_delete_account); //Ano ito
app.post('/ChangeCode', validation.security_code_validation, profile_controller.post_change_code);

// Schedule
app.get('/Schedule', validation.security_code_validation, controller.get_schedule);
app.get('/Schedule/:date/:location', validation.security_code_validation, schedule_controller.get_reservations);
app.get('/SchedulePrint', validation.security_code_validation, schedule_controller.print_reservations);

// Reservation
app.get('/Reservation', validation.security_code_validation, rsrv_controller.get_reservations);
app.post('/Reservation', validation.security_code_validation, rsrv_controller.post_reservations);
//Reservation Update and DeleteAccount
app.post('/ReservationUpdate', validation.security_code_validation, rsrv_controller.post_update_reservations);
app.post('/ReservationDelete', validation.security_code_validation, rsrv_controller.post_delete);


//Edit Driver
app.get('/EditDriver', validation.security_code_validation, edit_controller.get_drivers);
app.post('/DriverDelete', validation.security_code_validation, edit_controller.delete_driver);
app.post('/DriverInsert', validation.security_code_validation, edit_controller.insert_driver);


// Admin Reservation
app.get('/ReservationAdmin', validation.security_code_validation, rsrv_controller.get_reservation_admin);
app.get('/SearchUser', rsrv_controller.get_search_user)
app.post('/SearchUser', rsrv_controller.post_search_user);
// Admin Reservation Update and Delete
app.post('/SearchUserUpdate', rsrv_controller.post_search_user_update);
app.post('/SearchUserDelete', rsrv_controller.post_search_user_delete);

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = app;