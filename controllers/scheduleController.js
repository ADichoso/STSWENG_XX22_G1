const Reservation = require('../models/reservationdb.js');
const db = require('../models/db.js');

const scheduleController = {
	get_reservations: async (req, res) => {
		try {
			const { date, location, time } = req.params;
			const { button_clicked } = req.query;
			if(button_clicked=== 'entry') {
				const query = {
					date: date,
					entry_loc: location,
					// entry_time: time,
					};
				const reservations = await db.find_many(Reservation, query);
				console.log(reservations)

				return res.status(200).json(reservations);
			}
			else if (button_clicked === 'exit') 
			{
				const query = {
					date: date,
					exit_loc: location,
					// exit_time: time,
					};
				const reservations = await db.find_many(Reservation, query);
				
				console.log(reservations)
				return res.status(200).json(reservations);
			}
		} catch (err) {
			console.error('Error retrieving reservations:', err);
			return res.status(500).json({ error: 'Failed to retrieve reservations' });
		}
	},
};

module.exports = scheduleController;