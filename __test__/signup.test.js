const bcrypt = require('bcrypt')
const signup_controller = require('../controllers/signupController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const db = require('../models/db.js');
const { validationResult } = require('express-validator');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');
jest.mock('bcrypt');
jest.mock('express-validator');

describe('SignupController Test', () => {
    describe('get_signup', () => {
        test('should render the signup page', () => {
            req = {}
            res = { render: jest.fn() }
            signup_controller.get_signup(req, res);
            expect(res.render).toHaveBeenCalledWith('SignUp', res);
        });
    })
    describe('post_signup', () => {
        test('should successfully add a user', async () => {
            const req = {
                body: {
                    user_first_name: 'Unit',
                    user_last_name: 'Test',
                    user_email: 'unit_test@gmail.com',
                    user_id_number: '12396290',
                    user_password: '1234',
                    user_security_code: '123',
                    user_designation: 'Student',
                    user_passenger_type: 'Student',
                }
            };
        
            const res = { render: jest.fn() };
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('success').mockResolvedValueOnce('success');
        
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(true);
        
            // Setup validationResult mock to return an object with an isEmpty method that returns false
            validationResult.mockReturnValue({
                isEmpty: jest.fn().mockReturnValue(true),
                errors: []
            });
        
            await signup_controller.post_signup(req, res);
        
            expect(hash_mock).toHaveBeenCalledTimes(2); // For password and security code
            expect(insert_one_mock).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
                first_name: req.body.user_first_name,
                last_name: req.body.user_last_name,
                email: req.body.user_email,
                id_number: req.body.user_id_number,
                password: 'success',
                security_code: 'success',
                designation: req.body.user_designation,
                passenger_type: req.body.user_passenger_type,
                profile_picture: "images/profilepictures/Default.png"
            }));
        
            expect(res.render).toHaveBeenCalledWith('Login', {is_registered: true});
        });

        test('should not add a user if failed', async () => {
            jest.resetAllMocks();
            const req ={
                body : {
                    user_first_name: 'Unit',
                    user_last_name: 'Test',
                    user_email: 'unit_test@gmail.com',
                    user_id_number: '12396290',
                    user_password: '1234',
                    user_security_code: '123',
                    user_designation: 'Student',
                    user_passenger_type: 'Student',
                }
            }
            const res = { render: jest.fn() }
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('success').mockResolvedValueOnce('success');
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(false);
            validationResult.mockReturnValue({
                isEmpty: jest.fn().mockReturnValue(true),
                errors: []
            });

            await signup_controller.post_signup(req, res);

            expect(hash_mock).toHaveBeenCalledTimes(2);
        });

        test('should not add a user and render the signup page with errors if there are validation errors', async () => {
            jest.resetAllMocks();
            const req = {
                body: {
                    user_first_name: 'Unit',
                    user_last_name: 'Test',
                    user_email: 'unit_test@gmail.com',
                    user_id_number: '12396290',
                    user_password: '1234',
                    user_security_code: '123',
                    user_designation: 'Student',
                    user_passenger_type: 'Student',
                }
            };
            const res = { render: jest.fn() };
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('success').mockResolvedValueOnce('success');
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(true);
            validationResult.mockReturnValue({
                isEmpty: jest.fn().mockReturnValue(false),
                errors: [
                    { path: 'user_first_name', msg: 'First name is required' },
                    { path: 'user_last_name', msg: 'Last name is required' }
                ]
            });

            await signup_controller.post_signup(req, res);

            expect(hash_mock).not.toHaveBeenCalled();
            expect(insert_one_mock).not.toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('SignUp', {
                user_first_nameError: 'First name is required',
                user_last_nameError: 'Last name is required'
            });

        });

    })

    describe('get_check_ID', () => {
        test('should send the user result if found', async () => {
            jest.resetAllMocks();
            const req = { query: { id_number: '123456' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce('user_result');

            await signup_controller.get_check_ID(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: req.query.id_number });
            expect(res.send).toHaveBeenCalledWith('user_result');
        })

        test('should send the admin result if found', async () => {
            jest.resetAllMocks();
            const req = { query: { id_number: '123456' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce('admin_result');

            await signup_controller.get_check_ID(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: req.query.id_number });
            expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: req.query.id_number });
            expect(res.send).toHaveBeenCalledWith('admin_result');
        })

        test('should send the driver result if found', async () => {
            jest.resetAllMocks();
            const req = { query: { id_number: '123456' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce('driver_result');

            await signup_controller.get_check_ID(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: req.query.id_number });
            expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: req.query.id_number });
            expect(find_one_mock).toHaveBeenCalledWith(Driver, { id_number: req.query.id_number });
            expect(res.send).toHaveBeenCalledWith('driver_result');
        });

        test('should send null if no results are found', async () => {
            jest.resetAllMocks();
            const req = { query: { id_number: '123456' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await signup_controller.get_check_ID(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: req.query.id_number });
            expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: req.query.id_number });
            expect(find_one_mock).toHaveBeenCalledWith(Driver, { id_number: req.query.id_number });
            expect(res.send).toHaveBeenCalledWith(null);
        })
    })

    describe('get_check_email', () => {
        test('should send the user result if found', async () => {
            jest.resetAllMocks();
            const req = { query: { email: 'test@email.com' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce('user_result');

            await signup_controller.get_check_email(req, res);
            
            expect(find_one_mock).toHaveBeenCalledWith(User, { email: req.query.email }, 'email');
            expect(res.send).toHaveBeenCalledWith('user_result');
        })
        
        test('should send the admin result if found', async () => {
            jest.resetAllMocks();
            const req = { query: { email: 'test@email.com' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce('admin_result');

            await signup_controller.get_check_email(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { email: req.query.email }, 'email');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, { email: req.query.email }, 'email');
        })

        test('should send the driver result if found', async () => {
            jest.resetAllMocks();
            const req = { query: { email: 'test@email.com' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce('driver_result');

            await signup_controller.get_check_email(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { email: req.query.email }, 'email');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, { email: req.query.email }, 'email');
        })

        test('should send null if no results are found', async () => {
            jest.resetAllMocks();
            const req = { query: { email: 'test@email.com' } };
            const res = { send: jest.fn() };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await signup_controller.get_check_email(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, { email: req.query.email }, 'email');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, { email: req.query.email }, 'email');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, { email: req.query.email }, 'email');
            expect(res.send).toHaveBeenCalledWith(null);
        })
    })
})