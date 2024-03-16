const db = require('../models/db.js');

const bcrypt = require('bcrypt');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

const loginController = {

    get_login: async function (req, res) {

        if ( req.session.user_id_number ){

            const query = { user_id_number: req.session.user_id_number };
            const projection = { user_id_number: 1 };
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);

            if (user_result) {
                res.status(200).redirect('/Profile?user_id_number=' + req.session.user_id_number);     
            } else if (admin_result) {
                res.status(200).redirect('/ProfileAdmin?user_id_number=' + req.session.user_id_number);  
            } else if (driver_result) {
                res.status(200).redirect('/ProfileDriver?user_id_number=' + req.session.user_id_number);  
            } else {
                res.render('Login', { is_valid: false })
            }

        }
        else{
          res.render('Login');
        }
        
    },
    
    post_login: async function (req, res, next) {
        console.log("REQ: " + req.body.user_user_id_number);
        const user_id_number = req.body.user_user_id_number;
        const password = req.body.user_password;

        console.log("REQ" + req.body.user_id_number);

        try {
            const query = { user_id_number: user_id_number };
            const projection = { user_id_number: 1, password: 1};
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);
          
            if (user_result && await bcrypt.compare(password, user_result.password)) {

                req.session.user_id_number = user_result.user_id_number;

                res.redirect('/SecurityCheck?user_id_number=' + user_id_number);      
            } else if (admin_result && await bcrypt.compare(password, admin_result.password)) {
            
                req.session.user_id_number = admin_result.user_id_number;

                res.redirect('/SecurityCheck?user_id_number=' + user_id_number);

            } else if (driver_result && await bcrypt.compare(password, driver_result.password)) {
            
                req.session.user_id_number = driver_result.user_id_number;

                res.redirect('/SecurityCheck?user_id_number=' + user_id_number);

            } else {
                res.render('Login', { is_valid: false })
            }
                
            } catch (err) {
                res.status(500).send(err);
            }
        },

};

module.exports = loginController;
