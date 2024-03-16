const db = require('../models/db.js');

const { validationResult } = require('express-validator');

// import module `bcrypt`
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

const signupController = {

    get_signup: function (req, res) {
        res.render('SignUp',res);
    },

    post_signup: async function (req, res) {

        var errors = validationResult(req);

        if (!errors.isEmpty()){
            errors = errors.errors;

            var details = {};
            for ( var i = 0; i < errors.length; i++ ){
                details[errors[i].path + 'Error'] = errors[i].msg;
            }

            res.render('SignUp', details);
        }else{

            const user = {
                first_name: req.body.user_first_name,
                last_name: req.body.user_last_name,
                email: req.body.user_email,
                user_id_number: req.body.user_id_number,
                password: await bcrypt.hash(req.body.user_password, saltRounds),
                security_code: await bcrypt.hash(req.body.user_security_code, saltRounds),
                designation: req.body.user_designation,
                passenger_type: req.body.user_passenger_type,
                profile_picture: "images/profilepictures/Default.png"
            }
    
            var result = await db.insert_one(User, user);
    
            if( result ){
                console.log(result);
                console.log('User successfully added');
                res.render('Login', {is_registered: true});
            }
            else{
                console.log('User not added');
            }

        }
        
    },

    get_check_ID: async function (req, res) {
        var user_id_number = req.query.user_id_number;
        const user_result = await db.find_one(User, {user_id_number: user_id_number});
        const admin_result = await db.find_one(Admin, {user_id_number: user_id_number});
        const driver_result = await db.find_one(Driver, {user_id_number: user_id_number});
        
        if (user_result)
            res.send(user_result);
        else if (admin_result)
            res.send(admin_result);
        else if (driver_result)
            res.send(driver_result);
        else
            res.send(null);
        
    },

    get_check_email: async function (req, res) {
        var email = req.query.email;
        
        const user_result = await db.find_one(User, {email: email}, 'email');
        const admin_result = await db.find_one(Admin, {email: email}, 'email');
        const driver_result = await db.find_one(Driver, {email: email}, 'email');
        
        if (user_result)
            res.send(user_result);
        else if (admin_result)
            res.send(admin_result);
        else if (driver_result)
            res.send(driver_result);
        else
            res.send(null);

    },

}

module.exports = signupController;
