// import module from `../models/db.js`
const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

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
            const result = await db.find_one(User, query, projection);
            const result2 = await db.find_one(Admin, query, projection);

            if (result) {
                details = {
                    first_name : result.first_name,
                };
            } else if (result2) {
                details = {
                    first_name : result2.first_name,
                };
            }

            res.render('index', details);

        }else{
            details = {
                first_name : 'Login',
            }

            res.render('index', details);
        }
        
    },

    get_login: function (req, res) {
        res.render('Login',res);
    },

    get_signup: function (req, res) {
        res.render('SignUp',res);
    },
    
    get_search: function (req, res) {
        res.render('Search', res);
    },

    get_profile: function (req, res){
        res.render('Profile', res);
    },

    get_profile_admin: function (req, res){
        res.render('ProfileAdmin', res);
    },

    get_settings: async function (req, res){

        if ( req.session.id_number != req.query.id_number) {
            res.status(200).redirect('/Settings?id_number=' + req.session.id_number);     
        } else {

            var query = {id_number: req.query.id_number};
            const projection = 'id_number first_name last_name designation passenger_type';
    
            const resultUser = await db.find_one(User, query, projection);
            const resultAdmin = await db.find_one(Admin, query, projection);
    
            var details = {};
            
            if ( resultUser != null ) {
                details = {
                    id_number: resultUser.id_number,
                    first_name: resultUser.first_name,
                    last_name: resultUser.last_name,
                    designation: resultUser.designation,
                    passenger_type: resultUser.passenger_type,
                    is_admin: false,
                };
            }
            else if ( resultAdmin != null ) {
                details = {
                    id_number: resultAdmin.id_number,
                    first_name: resultAdmin.first_name,
                    last_name: resultAdmin.last_name,
                    designation: resultAdmin.designation,
                    passenger_type: resultAdmin.passenger_type,
                    is_admin: true,
                };
            }
            
            res.render('Settings', {"details": details});

        }



    },

    get_schedule: function (req, res){
        res.render('Schedule', res);
    },

    get_reservation: function (req, res){
        res.render('Reservation', res);
    },

    get_reservation_admin: function (req, res){
        res.render('ReservationAdmin', res);
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
