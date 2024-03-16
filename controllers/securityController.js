const db = require('../models/db.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

// import module `bcrypt`
const bcrypt = require('bcrypt');

const securityController = {

    get_security: async function (req, res) {

        const query = {user_id_number: req.query.user_id_number};

        const projection = 'user_id_number';
      
        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);
        var details = {};

        if ( user_result != null ){
            details = {
              user_id_number: user_result.user_id_number
            }
        } else if (admin_result != null) {
            details = {
              user_id_number: admin_result.user_id_number
            }
        } else if (driver_result != null) {
            details = {
              user_id_number: driver_result.user_id_number
            }
        }
        else {
          console.log('User does not exist.');
        }
        
        res.render('Security', details);
    },

    post_security: async function (req, res) {

        const { user_id_number, user_security_code } = req.body;
      
        const query = { user_id_number: user_id_number };     
        const projection = "user_id_number security_code";
        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);

        if (user_result && await bcrypt.compare(user_security_code, user_result.security_code)) 
        {
            req.session.is_sec_code_valid = true;
            res.status(200).redirect('/Profile?user_id_number=' + user_id_number);
        }
        else if (admin_result && await bcrypt.compare(user_security_code, admin_result.security_code))
        {
            req.session.is_sec_code_valid = true;
            res.status(200).redirect('/ProfileAdmin?user_id_number=' + user_id_number);
        }
        else if (driver_result && await bcrypt.compare(user_security_code, driver_result.security_code))
        {
            req.session.is_sec_code_valid = true;
            res.status(200).redirect('/ProfileDriver?user_id_number=' + user_id_number);
        }
        else
            res.render('Login', { is_code_correct: false });
    }
}

module.exports = securityController;
