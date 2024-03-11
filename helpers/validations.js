// import module `check` from `express-validator`
const { check } = require('express-validator');

/*
    defines an object which contains functions
    which returns array of validation middlewares
*/
const validation = {

    /*
        function which returns an array of validation middlewares
        called when the client sends an HTTP POST request for `/signup`
    */
    signup_validation: function () {

        /*
            object `validation` is an array of validation middlewares.
            the first parameter in method check() is the field to check
            the second parameter in method check() is the error message
            to be displayed when the value to the parameter fails
            the validation
        */
        var validation = [

            check('user_first_name', 'First name should not be empty.').notEmpty(),
            
            check('user_last_name', 'Last name should not be empty.').notEmpty(),

            check('user_email', 'Email should not be empty.').notEmpty(),

            check('user_id_number', 'ID number should not be empty.').notEmpty(),
            check('user_id_number', 'ID number should contain 8 digits.').isLength({min: 8, max: 8}),

            check('user_password', 'Password should not be empty.').notEmpty(),

            check('user_security_code', 'Security code should not be empty.').notEmpty(),
            check('user_security_code', 'Security code should contain 4 digits.').isLength({min: 4, max: 4}),
        ];

        return validation;

    },

    security_code_validation: function(req, res, next) 
    {
        if(req.session.id_number)
        {
            if(req.session.is_sec_code_valid)
                next();
            else
            {
                req.session.destroy();
                res.redirect(`/Login`);
            }
        }
        else
        {
            req.session.destroy();
            res.redirect(`/Login`);
        }
    }
    
}

/*
    exports the object `validation` (defined above)
    when another script exports from this file
*/
module.exports = validation;