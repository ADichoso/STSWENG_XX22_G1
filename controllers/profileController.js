const db = require('../models/db.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

const Reservation = require('../models/reservationdb.js');

// import module `bcrypt`
const bcrypt = require('bcrypt');
const saltRounds = 10;

const profileController = {

    get_profile: async function (req, res) {
        if ( req.session.id_number != req.query.id_number ) {

            const query = { id_number: req.session.id_number };
            const projection = "id_number";
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);
            if (user_result) 
                res.status(200).redirect('/Profile?id_number=' + req.session.id_number);
            else if (admin_result)
                res.status(200).redirect('/ProfileAdmin?id_number=' + req.session.id_number);  
            else if (driver_result) 
                res.status(200).redirect('/ProfileDriver?id_number=' + req.session.id_number);  
        } else {
            const query = {id_number: req.query.id_number};
            const projection = 'id_number first_name last_name designation passenger_type profile_picture';
            const result = await db.find_one(User, query, projection);
        
            if (result != null) {
        
                const details = {
                    id_number: result.id_number,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    designation: result.designation,
                    passenger_type: result.passenger_type,
                    profile_picture: result.profile_picture
                };

                const profile_data = {"details": details}
                res.render('Profile', profile_data);
            
            } else {
                res.status(500).render('Error',res);
            }
        }
        
    },

    get_profile_admin: async function (req, res) {

        if ( req.session.id_number != req.query.id_number ) {
            const query = { id_number: req.session.id_number };
            const projection = "id_number";
            
            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);
            if (user_result) 
                res.status(200).redirect('/Profile?id_number=' + req.session.id_number);
            else if (admin_result)
                res.status(200).redirect('/ProfileAdmin?id_number=' + req.session.id_number);  
            else if (driver_result) 
                res.status(200).redirect('/ProfileDriver?id_number=' + req.session.id_number);              
        } else {
            var query = {id_number: req.query.id_number};
            var projection = 'id_number first_name last_name designation passenger_type profile_picture';

            const result = await db.find_one(Admin, query, projection);
            
            if (result != null) {

                const details = 
                {
                    id_number: result.id_number,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    designation: result.designation,
                    passenger_type: result.passenger_type,
                    profile_picture: result.profile_picture
                };

                console.log(details)
                const profile_data = {"details": details}
                res.render('ProfileAdmin', profile_data);
            } else {
                res.status(500).render('Error',res);
            }
        
        }

    },

    get_profile_driver: async function (req, res) {

        if ( req.session.id_number != req.query.id_number ) {
            const query = { id_number: req.session.id_number };
            const projection = "id_number";

            const user_result = await db.find_one(User, query, projection);
            const admin_result = await db.find_one(Admin, query, projection);
            const driver_result = await db.find_one(Driver, query, projection);
            if (user_result) 
                res.status(200).redirect('/Profile?id_number=' + req.session.id_number);
            else if (admin_result)
                res.status(200).redirect('/ProfileAdmin?id_number=' + req.session.id_number);  
            else if (driver_result) 
                res.status(200).redirect('/ProfileDriver?id_number=' + req.session.id_number);  
            
        } else {
            var query = {id_number: req.query.id_number};
            var projection = 'id_number first_name last_name designation passenger_type profile_picture';

            const result = await db.find_one(Driver, query, projection);
            
            if (result != null) {

                const details = 
                {
                    id_number: result.id_number,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    designation: result.designation,
                    passenger_type: result.passenger_type,
                    profile_picture: result.profile_picture
                };

                const profile_data = {"details": details}
                res.render('ProfileDriver', profile_data);
            } else {
                res.status(500).render('Error',res);
            }
        
        }

    },

    post_change_public_info: function (req, res) {
        var query = {id_number: req.body.id_number };
        const projection = "id_number first_name last_name designation passenger_type";

        const user_result = db.find_one(User, query, projection);
        const admin_result = db.find_one(Admin, query, projection);
        const driver_result = db.find_one(Driver, query, projection);

        console.log(req.file)
        //Update user name
        if (user_result != null && (req.body.new_first_name != "" && req.body.new_last_name != "") ) { 
            db.update_one(User, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name})
            console.log("User public info change successful");
            res.status(200);
            res.redirect('/Profile?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
        }

        //Update admin name
        else if (admin_result != null && (req.body.new_first_name != "" && req.body.new_last_name != "") ) {
            db.update_one(Admin, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name})
            console.log("Admin user public info change successful");
            res.status(200);
            res.redirect('/ProfileAdmin?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
        }

        //Update driver name
        else if (driver_result != null && (req.body.new_first_name != "" && req.body.new_last_name != "") ) {
            db.update_one(Driver, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name})
            console.log("Driver user public info change successful");
            res.status(200);
            res.redirect('/ProfileDriver?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
        } else {
            //Update profile picture of User
            if ( ( user_result != null || admin_result != null || driver_result != null) & req.file != null){

                if ( user_result ){
                    db.update_one(User, query, {profile_picture: "profilepictures/" + req.body.id_number + ".png"})
                    res.status(200);
                    res.redirect('/Profile?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
                }
                else if ( admin_result ){
                    db.update_one(Admin, query, {profile_picture: "profilepictures/" + req.body.id_number + ".png"})
                    res.status(200);
                    res.redirect('/ProfileAdmin?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
                }
                else if ( driver_result ){
                    db.update_one(Driver, query, {profile_picture: "profilepictures/" + req.body.id_number + ".png"})
                    res.status(200);
                    res.redirect('/ProfileDriver?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
                }
            } else {
                console.log("User/Admin/Driver public info change unsuccessful");
                res.status(500).redirect('/Settings?id_number=' + req.body.id_number + '&infoChangeSuccess=false');
            }
        }
        
        
        
     

    },

    post_change_private_info: async function (req, res) {
        var query = {id_number: req.body.id_number };
        const projection = "id_number designation";

        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);

        if (user_result != null ) {
            await db.update_one(User, query, {designation: req.body.newDesignation})
            console.log("User private info change successful");
            res.redirect('/Profile?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
        }
        else if (admin_result != null ) {
            await db.update_one(Admin, query, {designation: req.body.newDesignation})
            console.log("Admin user private info change successful");
            res.redirect('/ProfileAdmin?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
        }
        else if (driver_result != null ) {
            await db.update_one(Driver, query, {designation: req.body.newDesignation})
            console.log("Driver user private info change successful");
            res.redirect('/ProfileDriver?id_number=' + req.body.id_number + '&infoChangeSuccess=true');
        }
        else {
            console.log("User/Admin/Driver private info change unsuccessful");
            res.status(500).redirect('/Settings?id_number=' + req.body.id_number + '&infoChangeSuccess=false');
        }

    },

    post_change_password: async function (req, res) {
        var query = {id_number: req.body.id_number};
        const projection = "id_number password";

        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);

        if (user_result != null && await bcrypt.compare(req.body.currentPassword, user_result.password) ) {
            await db.update_one(User, query, {password: await bcrypt.hash(req.body.newPassword, saltRounds)})
            console.log("User password change successful");
            res.redirect('/Profile?id_number=' + req.body.id_number + '&pwChangeSuccess=true');
        }
        else if (admin_result != null && await bcrypt.compare(req.body.currentPassword, admin_result.password)) {
            await db.update_one(Admin, query, {password: await bcrypt.hash(req.body.newPassword, saltRounds)} )
            console.log("Admin user password change successful");
            res.redirect('/ProfileAdmin?id_number=' + req.body.id_number + '&pwChangeSuccess=true');
        }
        else if (driver_result != null && await bcrypt.compare(req.body.currentPassword, driver_result.password)) {
            await db.update_one(Driver, query, {password: await bcrypt.hash(req.body.newPassword, saltRounds)} )
            console.log("Driver user password change successful");
            res.redirect('/ProfileDriver?id_number=' + req.body.id_number + '&pwChangeSuccess=true');
        }
        else {
            console.log("User/Admin/Driver password change unsuccessful");
            res.status(500).redirect('/Settings?id_number=' + req.body.id_number + '&pwChangeSuccess=false');
        }

    },

    post_change_code: async function (req, res) {
        var query = {id_number: req.body.id_number};
        const projection = "id_number security_code";
        
        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);

        if (user_result != null && await bcrypt.compare(req.body.currentSecCode, user_result.securityCode)) {
            await db.update_one(User, query, {securityCode: await bcrypt.hash(req.body.newSecCode, saltRounds)});
            console.log("User code change successful");
            res.redirect('/Profile?id_number=' + req.body.id_number + '&codeChangeSuccess=true');
        }
        else if (admin_result != null && await bcrypt.compare(req.body.currentSecCode, admin_result.securityCode)) {
            await db.update_one(Admin, query, {securityCode: await bcrypt.hash(req.body.newSecCode, saltRounds)});
            console.log("User code change successful");
            res.redirect('/ProfileAdmin?id_number=' + req.body.id_number + '&codeChangeSuccess=true');
        }
        else if (driver_result != null && await bcrypt.compare(req.body.currentSecCode, driver_result.securityCode)) {
            await db.update_one(Driver, query, {securityCode: await bcrypt.hash(req.body.newSecCode, saltRounds)});
            console.log("User code change successful");
            res.redirect('/ProfileDriver?id_number=' + req.body.id_number + '&codeChangeSuccess=true');
        }
        else {
            console.log(req.body.currentSecCode);
            console.log(req.body.newSecCode);
            
            console.log("User/Admin/Driver security code change unsuccessful");
            res.status(500).redirect('/Settings?id_number=' + req.body.id_number + '&codeChangeSuccess=false');
        }

    },

    post_delete_account: async function (req, res) {
        var query = {id_number: req.body.id_number};
        const projection = "id_number password";
        
        const user_result = await db.find_one(User, query, projection);
        const admin_result = await db.find_one(Admin, query, projection);
        const driver_result = await db.find_one(Driver, query, projection);

        var details = {};
        var error = null;

        if (user_result != null && await bcrypt.compare(req.body.Password, user_result.password) ) {
            await db.delete_one(User, query);
            await db.delete_many(Reservation, query);

            details = {
            first_name : 'Login',
            }
            
            req.session.destroy(function(err) {
                error = err
            });
    
            if(error != null)
                res.status(500).render('Error');
            else {
                res.status(200);
                res.render('index', details);
            }
            
        }
        else if (admin_result != null && await bcrypt.compare(req.body.Password, admin_result.password) ) {
            await db.delete_one(Admin, query);
            await db.delete_many(Reservation, query);
            console.log("Admin user deleted");

            details = {
            first_name : 'Login',
            }
            
            req.session.destroy(function(err) {
                error = err
            });
    
            if(error != null)
                res.status(500).render('Error');
            else {
                res.status(200);
                res.render('index', details);
            }
        }
        else if (driver_result != null && await bcrypt.compare(req.body.Password, driver_result.password) ) {
            await db.delete_one(Driver, query);
            await db.delete_many(Reservation, query);
            console.log("Admin user deleted");

            details = {
                first_name : 'Login',
            }
            
            req.session.destroy(function(err) {
                error = err
            });
    
            if(error != null)
                res.status(500).render('Error');
            else {
                res.status(200);
                res.render('index', details);
            }
        }
        else {
            console.log("User/Admin not deleted");
            res.redirect('/Settings?id_number=' + req.body.id_number + '&deleteSuccess=false');
        }

    },

    get_logout: function (req, res) {
        var error = null;
        req.session.destroy(function(err) {
            error = err
        });

        if(error != null)
            res.status(500).render('Error');
        else {
            res.status(200);
            res.redirect('/');
        }
    }
    
}

module.exports = profileController;
