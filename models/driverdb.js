var mongoose = require('mongoose');

var driver_schema = new mongoose.Schema({
    id_number: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    security_code: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Driver', driver_schema);