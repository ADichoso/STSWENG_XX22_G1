var mongoose = require('mongoose');

var reservation_schema = new mongoose.Schema({
    start_campus: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        require: true,
    },
    entry_loc: {
        type: String,
        required: true,
    },
    entry_time: {
        type: String,
        required: true,
    },
    exit_loc: {
        type: String,
        required: true,
    },
    exit_time: {
        type: String,
        required: true,
    },
    user_id_number: { //This is used to bind a reservation to a user. Many-to-one relation.
        type: Number,
        required: false,
    }
});

module.exports = mongoose.model('Reservation', reservation_schema);
