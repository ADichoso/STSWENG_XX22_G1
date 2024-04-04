const User = require('./models/userdb.js');
const Admin = require('./models/admindb.js');
const Driver = require('./models/driverdb.js');

const db = require('./models/db.js');
const Reservation = require('./models/reservationdb.js');
const bcrypt = require('bcrypt');
const { create } = require('hbs');
const saltRounds = 10;

var password;
var securityCode;

async function generateInfo(password, securityCode){
  password = await bcrypt.hash(password, saltRounds);
  securityCode =  await bcrypt.hash(securityCode, saltRounds);
  return { password, securityCode };
}

db.connect();

async function createDrivers(){
  var { password, securityCode } = await generateInfo('4554', '4554');
  var driver = {
    first_name: 'Driver3',
    last_name: 'Driver3',
    email: 'd@driver.com',
    id_number: 45544554,
    password: password,
    security_code: securityCode,
    profile_picture: 'images/profilepictures/Default.png'
    };

    var result = await db.insert_one(Driver, driver);
    console.log('Driver successfully added');

}

async function createAdmins(){
    var { password, securityCode } = await generateInfo('8989', '8989');
    var admin = {
        first_name: 'Admin',
        last_name: 'Admin',
        email: 'admin@admin.com',
        id_number: 89898989,
        password: password,
        security_code: securityCode,
        designation: 'Faculty',
        passenger_type: 'Employee',
        profile_picture: 'images/profilepictures/Default.png'

    };
    var result = await db.insert_one(Admin, admin);
    console.log('Admin successfully added');
}

async function createUsers(){
    var { password, securityCode } = await generateInfo('3443', '3443');
    var user = {
        first_name: 'User',
        last_name: 'User',
        email: 'user@user.com',
        id_number: 34433443,
        password: password,
        security_code: securityCode,
        designation: 'Student',
        passenger_type: 'Student',
        profile_picture: 'images/profilepictures/Default.png'
    };

    var result = await db.insert_one(User, user);
    console.log('User successfully added');


}


createUsers();
createAdmins();
createDrivers();
