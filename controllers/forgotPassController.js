const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const forgotPassController = {

    get_forgot_password: function (req, res) {
        res.render('ForgotPassword', res);
    },

    post_forgot_password: async function (req, res){

        var query = {email: req.body.user_email, securityCode: req.body.user_security_code};

        const resultUser = await db.find_one(User, query, 'user_id_number email securityCode');
        const resultAdmin = await db.find_one(Admin, query, 'user_id_number email securityCode');

        var details = {};

        if ( resultUser != null && (resultUser.email == req.body.user_email && resultUser.securityCode == req.body.user_security_code) ) {
            console.log('User email and security code match.');

            details = {
                user_id_number: resultUser.user_id_number,
                email: resultUser.email,
                securityCode: resultUser.securityCode
            }

            res.render('ForgotPassword', details);
        }
        else if ( resultAdmin != null && (resultAdmin.email == req.body.user_email && resultAdmin.securityCode == req.body.user_security_code) ) {
            console.log('Admin email and security code match.');

            details = {
                user_id_number: resultAdmin.user_id_number,
                email: resultAdmin.email,
                securityCode: resultAdmin.securityCode
            }
            res.render('ForgotPassword', details);
        }
        else{
            res.render('ForgotPassword', { isInvalid: true });
        }

    },

    post_change_F_password: async function (req, res){

        var newPassword0 = req.body.user_newPassword0;
        var newPassword1 = req.body.user_newPassword1;

        if ( newPassword0 == newPassword1 ){

            var query = {user_id_number: req.body.user_id_number};
            const projection = { user_id_number: 1, password: 1};

            const resultUser = await db.find_one(User, query, projection);
            const resultAdmin = await db.find_one(Admin, query, projection);

            if ( resultUser != null ) {
                await User.updateOne(query, {password: req.body.user_newPassword1})
                console.log("Change password successful");
                res.render('Login', { codeChange: true } );
            }
            else if ( resultAdmin != null ) {
                await Admin.updateOne(query, {password: req.body.user_newPassword1})
                console.log("Change password successful");
                res.render('Login', { codeChange: true } );
            } else {
                console.log("User/Admin password change unsuccessful. No user/admin found.");
                res.render('ForgotPassword', res);
            }

        }
        else{
            res.render('ForgotPassword', { isMatch: false, user_id_number: req.body.user_id_number } );
        }

        

    }
}

module.exports = forgotPassController;