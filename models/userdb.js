var mongoose = require('mongoose');

var user_schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
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
    },
    designation: {
        type: String,
        required: true,
    },
    passenger_tye: {
        type: String,
        required: true,
    },
    profile_picture:{
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('User', user_schema);