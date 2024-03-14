$(document).ready(function () {

    function is_filled() {

        var user_first_name = validator.trim($('#user_first_name').val());
        var user_last_name = validator.trim($('#user_last_name').val());
        var user_email = validator.trim($('#user_email').val());
        var id_number = validator.trim($('#id_number').val());
        var user_password = validator.trim($('#user_password').val());
        var user_security_code = validator.trim($('#user_security_code').val());
        var user_designation = $('#user_designation').val() || ''; 
        var user_passenger_type = $('#user_passenger_type').val() || ''; 

        /*
            checks if the trimmed values in fields are not empty
        */
        var fNameEmpty = validator.isEmpty(user_first_name);;
        var lNameEmpty = validator.isEmpty(user_last_name);
        var emailEmpty = validator.isEmpty(user_email);
        var idNumEmpty = validator.isEmpty(id_number);
        var passwordEmpty = validator.isEmpty(user_password);
        var securityCodeEmpty = validator.isEmpty(user_security_code);
        var designationEmpty = validator.isEmpty(user_designation);
        var passengerTypeEmpty = validator.isEmpty(user_passenger_type);

        return !fNameEmpty && !lNameEmpty && !emailEmpty && !idNumEmpty && !passwordEmpty && !securityCodeEmpty && !designationEmpty && !passengerTypeEmpty;
    }

    async function is_valid_ID(field, callback) {

        var idNum = validator.trim($('#id_number').val());

        var onlyNumbers = /^[0-9]*$/;
        if (!onlyNumbers.test(idNum)) {
            $("#error_box").css('display', 'block');
            $('#error_message').text('ID number should contain only numbers.');
            return callback(false);
        }
        else{

            var is_valid_length = validator.isLength(idNum, {min: 8, max: 8});

            if(is_valid_length) {
                
                const result = await $.get('/getCheckID', {id_number: idNum} ) 
                
                if ( result != null ) {

                    if( result.id_number != idNum ) {

                        if(field.is($('#id_number'))){
                            $('#error_message').text('');
                        }
                                
                        return callback(true);
                    }
                    else {

                        if(field.is($('#id_number'))){
                            $('#error_box').css('display', 'block');
                            $('#error_message').text('ID number already registered.');
                        }
                                
                        return callback(false);
                    }

                }else{
                    // No result returned from the server

                    $('#error_message').text('');
                    $('error_box').css('display', 'none');
                    
                    return callback(true);
                }

            }
            else if ( !is_valid_length ){

                if(field.is($('#id_number'))){
                    $('#error_box').css('display', 'block');
                    $('#error_message').text('ID number should contain exactly 8 digits.');
                }
                   
                return callback(false);

            }

        }

    }

    function isValidSecurityCode(callback) {

        var securityCode = validator.trim($('#user_security_code').val());

        var onlyNumbers = /^[0-9]*$/;
        if (!onlyNumbers.test(securityCode)) {
            $("#error_box").css('display', 'block');
            $('#error_message').text('Security Code should contain only numbers.');
            return callback(false);
        }
        else{
            return callback(true);
        }

    }

    async function isValidEmail(callback){

        var email = validator.trim($('#user_email').val());

        var validEmail = validator.isEmail(email);

        if(validEmail) {

            const result = await $.get('/getCheckEmail', {email: email} )

            if ( result.email != email ) {
                return callback(true);
            }
            else{
                $("#error_box").css('display', 'block');
                $('#error_message').text('Email already registered.');
                return callback(false);
            }
        }

    }


    async function validate_field(field, fieldName, error) {

        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);
    
        if(empty) {
   
            field.prop('value', '');
            // display approriate error message in `error`
            $('#error_box').css('display', 'block');
            error.text(fieldName + ' should not be empty.');
        }

        // else if the value of `field` is not empty
        else{
            // remove the error message in `error`
            error.text('');
            $('#error_box').css('display', 'none');
            
        }
            
        var filled = is_filled();

        var validEmail;
        await isValidEmail( function(boolean){
            validEmail = boolean;
        });

        var validSecurityCode;
        await isValidSecurityCode( function(boolean){
            validSecurityCode = boolean;
        });

        is_valid_ID(field, function (validID) {

            if( filled && validID && validSecurityCode && validEmail ) {
                $('#submit').prop('disabled', false);
                $('#submit').css('background', 'green');
                $('#submit').css('cursor', 'pointer');
            }
            else{
                $('#submit').prop('disabled', true);
                $('#submit').css('background', '#cccccc');
                $('#submit').css('cursor', 'not-allowed');
            }
                
        });
    }

    $('#user_first_name').keyup(function () {
        validate_field($('#user_first_name'), 'First name', $('#error_message'));
    });

    $('#user_last_name').keyup(function () {
        validate_field($('#user_last_name'), 'Last name', $('#error_message'));
    });

    $('#user_email').keyup(function () {
        validate_field($('#user_email'), 'Email', $('#error_message'));
    });

    $('#id_number').keyup(function () {
        validate_field($('#id_number'), 'ID Number', $('#error_message'));
    });

    $('#user_security_code').keyup(function () {
        validate_field($('#user_security_code'), 'Security Code', $('#error_message'));
    });

    $('#user_designation').on('change', function () {
        validate_field($('#user_designation'), 'Designation', $('#error_message'));
    });
    
    $('#user_passenger_type').on('change', function () {
        validate_field($('#user_passenger_type'), 'Passenger Type', $('#error_message'));
    });
    

});