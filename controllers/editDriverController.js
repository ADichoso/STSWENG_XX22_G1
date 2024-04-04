const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const editDriverController = {
    get_drivers: async function (req, res) {
		
		if ( req.session.id_number != req.query.id_number ) {
			res.redirect('/EditDriver?id_number=' + req.session.id_number );
		}else{
			const query = { id_number: req.query.id_number };
			const projection = "id_number";
			
			const is_admin = await db.find_one(Admin, query, projection);
	
			const result = await db.find_many(Driver, {}, "");
			if ( is_admin != null ) {
				res.render('EditDriver', {result: result, id_number: req.query.id_number});
			} else {
				res.status(500);
                res.render('/');
			}
		}

		
    },

    delete_driver: async function(req, res)
    {
        var admin_id = req.body.d_admin_id;

        var curr ={
			first_name: req.body.d_curr_first_name,
			last_name: req.body.d_curr_last_name,
			email: req.body.d_curr_email,
			id_number: req.body.d_curr_id_number
		}

        await db.delete_one(Driver, curr);

        res.redirect('/EditDriver?id_number=' + admin_id);
    },

    insert_driver: async function(req, res)
    {
        var admin_id = req.body.admin_id;

        var curr ={
			first_name: req.body.curr_first_name,
			last_name: req.body.curr_last_name,
			email: req.body.curr_email,
			id_number: req.body.curr_id_number,
            password: await bcrypt.hash("111111", saltRounds),
            security_code: await bcrypt.hash("1234", saltRounds),
            profile_picture: "images/profilepictures/Default.png"
		}

        await db.insert_one(Driver, curr);

        res.redirect('/EditDriver?id_number=' + admin_id);
    }
}

module.exports = editDriverController;