// import module from `../models/db.js`
const db = require('../models/db.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');


/*
    defines an object which contains functions executed as callback
    when a client requests for a certain path in the server
*/
const controller = {

    get_index: async function (req, res) {

        var details = {};

        if ( req.session.id_number ) {

            const query = { id_number: req.session.id_number };
            const projection = "first_name";
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);

            if (user_result) 
                details.first_name = user_result.first_name;
            else if (admin_result) 
                details.first_name = admin_result.first_name;
            else if (driver_result) 
                details.first_name = driver_result.first_name;

            details.isSecCodeValid = req.session.isSecCodeValid;
            res.render('index', details);

        }else{
            details = {
                first_name : 'Login',
            }

            res.render('index', details);
        }
        
    },

    get_settings: async function (req, res){

        if ( req.session.id_number != req.query.id_number) {
            res.status(200).redirect('/Settings?id_number=' + req.session.id_number);     
        } else {

            var query = {id_number: req.query.id_number};
            const projection = 'id_number first_name last_name designation passenger_type';
    
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);
    
            var details = {};
            
            if ( user_result != null ) {
                details = {
                    id_number: user_result.id_number,
                    first_name: user_result.first_name,
                    last_name: user_result.last_name,
                    designation: user_result.designation,
                    passenger_type: user_result.passenger_type,
                    is_admin: false,
                    not_driver: true
                };
            }
            else if ( admin_result != null ) {
                details = {
                    id_number: admin_result.id_number,
                    first_name: admin_result.first_name,
                    last_name: admin_result.last_name,
                    designation: admin_result.designation,
                    passenger_type: admin_result.passenger_type,
                    is_admin: true,
                    not_driver: true
                };
            }
            else if ( driver_result != null ) {
                details = {
                    id_number: driver_result.id_number,
                    first_name: driver_result.first_name,
                    last_name: driver_result.last_name,
                    designation: driver_result.designation,
                    passenger_type: driver_result.passenger_type,
                    is_admin: false,
                    not_driver: false
                };
            }
            
            res.render('Settings', {"details": details});

        }



    },

    get_schedule: function (req, res){
        res.render('Schedule', res);
    },

    get_error: function (req, res) {
        res.render('Error', res);
    },

}

/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = controller;
