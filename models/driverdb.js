var mongoose = require('mongoose');

var driver_schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    id_number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    security_code: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Driver', driver_schema);