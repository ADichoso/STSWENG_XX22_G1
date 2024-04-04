const bcrypt = require('bcrypt')
const profile_controller = require('../controllers/profileController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const db = require('../models/db.js');
const { query } = require('express');
const controller = require('../controllers/forgotPassController.js');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');
jest.mock('bcrypt');

describe('ForgotPassController - get_forgot_password', () => {
    afterEach(() => {
        jest.resetAllMocks();
     });
    test('get_forgot_password should render the ForgotPassword page', () => {
        let req = {};
        let res = {render: jest.fn()};

        controller.get_forgot_password(req,res);

        expect(res.render).toHaveBeenCalledWith('ForgotPassword', res);
    });
});

describe('ForgotPassController - post_forgot_password', () => {
    describe('post_forgot_password should render the ForgotPassword page with account details', () => {
        describe('email and security code body fields should match with database entry', () => {
            afterEach(() => {
                jest.resetAllMocks();
             });
            test('account is a user', async () => {
                let req = {body: {user_email: 'user_email', user_security_code: '1111'}};
                let res = {render: jest.fn()};

                const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999, email: 'user_email', security_code: '1111'}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
                const compare_mock = jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
                await controller.post_forgot_password(req,res);

                expect(find_one_mock).toHaveBeenCalledWith(User, {email: 'user_email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Admin, {email: 'user_email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Driver, {email: 'user_email'}, 'id_number email security_code');
                expect(compare_mock).toHaveBeenCalledWith('1111', '1111');
                expect(res.render).toHaveBeenCalledWith('ForgotPassword', {id_number: 9999999, email: 'user_email', security_code: '1111'});
            });
            test('account is an admin', async () => {
                let req = {body: {user_email: 'admin_email', user_security_code: '1111'}};
                let res = {render: jest.fn()};

                const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999, email: 'admin_email', security_code: '1111'}).mockResolvedValueOnce(null);
                const compare_mock = jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

                await controller.post_forgot_password(req,res);

                expect(find_one_mock).toHaveBeenCalledWith(User, {email: 'admin_email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Admin, {email: 'admin_email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Driver, {email: 'admin_email'}, 'id_number email security_code');
                expect(compare_mock).toHaveBeenCalledWith('1111', '1111');
                expect(res.render).toHaveBeenCalledWith('ForgotPassword', {id_number: 9999999, email: 'admin_email', security_code: '1111'});
            });
            test('account is a driver', async () => {
                let req = {body: {user_email: 'driver_email', user_security_code: '1111'}};
                let res = {render: jest.fn()};

                const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999, email: 'driver_email', security_code: '1111'});
                const compare_mock = jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

                await controller.post_forgot_password(req,res);

                expect(find_one_mock).toHaveBeenCalledWith(User, {email: 'driver_email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Admin, {email: 'driver_email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Driver, {email: 'driver_email'}, 'id_number email security_code');
                expect(compare_mock).toHaveBeenCalledWith('1111', '1111');
                expect(res.render).toHaveBeenCalledWith('ForgotPassword', {id_number: 9999999, email: 'driver_email', security_code: '1111'});
            });
        });

        describe('email and security code body fields do not match with database entry', () => {
            afterEach(() => {
                jest.resetAllMocks();
             });
            test('account is not a user, admin or driver', async () => {
                let req = {body: {user_email: 'email', user_security_code: '1111'}};
                let res = {render: jest.fn()};

                const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
                await controller.post_forgot_password(req,res);

                expect(find_one_mock).toHaveBeenCalledWith(User, {email: 'email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Admin, {email: 'email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Driver, {email: 'email'}, 'id_number email security_code');
                expect(res.render).toHaveBeenCalledWith('ForgotPassword', {is_invalid: true});
            });

            test('email or security code do not match with database entry', async () => {
                let req = {body: {user_email: 'email', user_security_code: '1111'}};
                let res = {render: jest.fn()};

                const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
                
                await controller.post_forgot_password(req,res);

                expect(find_one_mock).toHaveBeenCalledWith(User, {email: 'email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Admin, {email: 'email'}, 'id_number email security_code');
                expect(find_one_mock).toHaveBeenCalledWith(Driver, {email: 'email'}, 'id_number email security_code');
                expect(res.render).toHaveBeenCalledWith('ForgotPassword', {is_invalid: true});
            });
        });

    });
});

describe('ForgotPassController - post_change_F_password', () => {
    describe('new_password and retype_password body fields should match', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });
        
        test('new_password and retype_password do not match', async () => {
            let req = {body: {user_new_password: 'password', user_retype_password: 'password2', id_number: 9999999}};
            let res = {render: jest.fn()};

            await controller.post_change_F_password(req,res);

            expect(res.render).toHaveBeenCalledWith('ForgotPassword', {isMatch: false, id_number: 9999999});
        });

        test('account is a user', async () => {
            let req = {body: {user_new_password: 'password', user_retype_password: 'password', user_id_number: 9999999, user_email: "test"}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999, password: 'password'}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce();
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password');
            
            await controller.post_change_F_password(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: undefined, email: 'test'}, 'id_number password');

            expect(hash_mock).toHaveBeenCalledWith('password', 10);
            expect(update_one_mock).toHaveBeenCalledWith(User, {id_number: undefined, email: 'test'}, {password: 'hashed_password'});
            expect(res.render).toHaveBeenCalledWith('Login', {code_change: true});
        });

        test('account is an admin', async () => {
            let req = {body: {user_new_password: 'password', user_retype_password: 'password', user_id_number: 9999999, user_email: "test"}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999, password: 'password'}).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce();
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password');
            
            await controller.post_change_F_password(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: undefined, email: 'test'}, 'id_number password');

            expect(hash_mock).toHaveBeenCalledWith('password', 10);
            expect(update_one_mock).toHaveBeenCalledWith(Admin, {id_number: undefined, email: "test"}, {password: 'hashed_password'});
            expect(res.render).toHaveBeenCalledWith('Login', {code_change: true});
        });

        test('account is a driver', async () => {
            let req = {body: {user_new_password: 'password', user_retype_password: 'password', user_id_number: 9999999, user_email: "test"}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999, email:"test",password: 'password'});
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce();
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password');
            
            await controller.post_change_F_password(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: undefined, email: 'test'}, 'id_number password');

            expect(hash_mock).toHaveBeenCalledWith('password', 10);
            expect(update_one_mock).toHaveBeenCalledWith(Driver, {id_number: undefined, email: "test"}, {password: 'hashed_password'});
            expect(res.render).toHaveBeenCalledWith('Login', {code_change: true});
        });

        test('account is not a user, admin or driver', async () => {
            let req = {body: {user_new_password: 'password', user_retype_password: 'password', user_id_number: 9999999, user_email: "test"}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            
            await controller.post_change_F_password(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: undefined, email: 'test'}, 'id_number password');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: undefined, email: 'test'}, 'id_number password');

            expect(res.render).toHaveBeenCalledWith('ForgotPassword', res);
        });

    });
});