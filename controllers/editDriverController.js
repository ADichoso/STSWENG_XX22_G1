const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

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
}

module.exports = editDriverController;