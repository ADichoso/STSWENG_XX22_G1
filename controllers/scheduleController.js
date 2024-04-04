const Reservation = require('../models/reservationdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const User = require('../models/userdb.js');
const { jsPDF } = require("jspdf");

const db = require('../models/db.js');
// const Jolt = require('jolt');


const to_laguna_campus = 
	//MANILA ENTRY
[
	"DLSU Manila -> DLSU LC", 
	//LAGUNA ENTRY
	"Paseo -> DLSU LC", 
	"Carmona -> DLSU LC", 
	"Pavilion Mall -> DLSU LC", 
	"Walter Mart -> DLSU LC",
	"N/A"
];

const from_laguna_campus = 
	//LAGUNA AND MANILA EXIT
[	
	"DLSU LC -> DLSU Manila", 
	"DLSU LC -> Paseo", 
	"DLSU LC -> Carmona",
	"DLSU LC -> Pavilion Mall", 
	"DLSU LC -> Walter Mart",
	"N/A"
];

const scheduleController = {
	get_reservations: async (req, res) => {
		try {
			const { date, location, time } = req.params;
			const { button_clicked } = req.query;
			// if(button_clicked=== 'entry') {
			const to_query = {
				date: date,
				entry_loc: to_laguna_campus[location],
				// entry_time: time,
				};
			const from_query = {
				date: date,
				exit_loc: from_laguna_campus[location],
				// entry_time: time,
				};
			const to_laguna = await db.find_many(Reservation, to_query);
			const from_laguna = await db.find_many(Reservation, from_query);

			var to_id_array = [];
			var from_id_array = [];

			const admin = await db.find_one(Admin, {id_number: req.session.id_number});
			const driver = await db.find_one(Driver, {id_number: req.session.id_number});

			if ( admin || driver ) {
				to_laguna.forEach(element => {
					to_id_array.push(element.id_number)
				});
	
				from_laguna.forEach(element => {
					from_id_array.push(element.id_number)
				});
				is_admin = true;
				const to_query_name = {
					id_number: {$in: to_id_array}
					};
				const from_query_name = {
					id_number: {$in: from_id_array},
					};
				
				var projection = "id_number last_name first_name";
				console.log({to_laguna: to_laguna, from_laguna: from_laguna});
				const to_names_user = await db.find_many(User, to_query_name, projection);
				const from_names_user = await db.find_many(User, from_query_name, projection);
				const to_names_driver = await db.find_many(Driver, to_query_name, projection);
				const from_names_driver = await db.find_many(Driver, from_query_name, projection);
				const to_names_admin = await db.find_many(Admin, to_query_name, projection);
				const from_names_admin = await db.find_many(Admin, from_query_name, projection);

				var to_names_array = to_names_user.concat(to_names_driver, to_names_admin);
				var from_names_array = from_names_user.concat(from_names_driver, from_names_admin);

				var to_names = {};
				var from_names = {};

				to_names_array.forEach(element => {
					to_names[element.id_number] = {first_name: element.first_name, last_name: element.last_name}
				});

				from_names_array.forEach(element => {
					from_names[element.id_number] = {first_name: element.first_name, last_name: element.last_name}
				});

				console.log({to_names: to_names, from_names: from_names});
				return res.status(200).json({
					location: location, 
					to_laguna: to_laguna, 
					from_laguna: from_laguna, 
					is_admin: true, 
					to_names: to_names, 
					from_names: from_names
				});
			}
			// console.log({location: location, to_laguna: to_laguna, from_laguna: from_laguna, is_admin: is_admin});

			return res.status(200).json({location: location, to_laguna: to_laguna, from_laguna: from_laguna, is_admin: false});
			// }
			// else if (button_clicked === 'exit') 
			// {
			// 	const query = {
			// 		date: date,
			// 		exit_loc: location,
			// 		// exit_time: time,
			// 		};
			// 	const reservations = await db.find_many(Reservation, query);
				
			// 	console.log(reservations)
			// 	return res.status(200).json(reservations);
			// }
		} catch (err) {
			console.error('Error retrieving reservations:', err);
			return res.status(500).json({ error: 'Failed to retrieve reservations' });
		}
	},
	print_reservations: async (req, res) => {
		const doc = new jsPDF();
		doc.text("Hello world!", 10, 10);
		return res.status(200).json({doc: doc});
	}
};

module.exports = scheduleController;