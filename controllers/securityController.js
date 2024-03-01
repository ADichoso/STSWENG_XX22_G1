const db = require('../models/db.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

// import module `bcrypt`
const bcrypt = require('bcrypt');

const securityController = {

    get_security: async function (req, res) {

        const query = {id_number: req.query.id_number};

        const projection = 'id_number';
      
        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);
        var details = {};

        if ( user_result != null ){
            details = {
              id_number: user_result.id_number
            }
        } else if (admin_result != null) {
            details = {
              id_number: admin_result.id_number
            }
        } else if (driver_result != null) {
            details = {
              id_number: driver_result.id_number
            }
        }

        else {
          console.log('User does not exist.');
        }
        
        res.render('Security', details);
    },

    post_security: async function (req, res) {

        const id_number = req.body.id_number;
        const security_code = req.body.user_security_code;
      
        try {
            const query = { id_number: id_number };
            const projection = { id_number: 1, security_code: 1};
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);

            if (user_result != null && await bcrypt.compare(security_code, user_result.security_code)) 
			    res.status(200).redirect('/Profile?id_number=' + id_number);
            else if (admin_result != null && await bcrypt.compare(security_code, admin_result.security_code))
			    res.status(200).redirect('/ProfileAdmin?id_number=' + id_number);
            else if (driver_result != null && await bcrypt.compare(security_code, driver_result.security_code))
			    res.status(200).redirect('/ProfileDriver?id_number=' + id_number);
            else
                res.render('Login', { is_code_correct: false });
		
        } catch (err) {
          res.status(500).send(err);
        }
    }
}

module.exports = securityController;
