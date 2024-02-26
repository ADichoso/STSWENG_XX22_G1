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

        if ( req.session.idNumber ) {

            const query = { idNumber: req.session.idNumber };
            const projection = { firstName: 1};
            const result = await db.findOne(User, query, projection);
            const result2 = await db.findOne(Admin, query, projection);

            if (result) {
                details = {
                    firstName : result.firstName,
                };
            } else if (result2) {
                details = {
                    firstName : result2.firstName,
                };
            }

            res.render('index', details);

        }else{
            details = {
                firstName : 'Login',
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

        if ( req.session.idNumber != req.query.idNumber) {
            res.status(200).redirect('/Settings?idNumber=' + req.session.idNumber);     
        } else {

            var query = {idNumber: req.query.idNumber};
            const projection = 'idNumber firstName lastName designation passengerType';
    
            const resultUser = await db.findOne(User, query, projection);
            const resultAdmin = await db.findOne(Admin, query, projection);
    
            var details = {};
            
            if ( resultUser != null ) {
                details = {
                    idNumber: resultUser.idNumber,
                    firstName: resultUser.firstName,
                    lastName: resultUser.lastName,
                    designation: resultUser.designation,
                    passengerType: resultUser.passengerType,
                    isAdmin: false,
                };
            }
            else if ( resultAdmin != null ) {
                details = {
                    idNumber: resultAdmin.idNumber,
                    firstName: resultAdmin.firstName,
                    lastName: resultAdmin.lastName,
                    designation: resultAdmin.designation,
                    passengerType: resultAdmin.passengerType,
                    isAdmin: true,
                };
            }
            
            res.render('Settings', details);

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
