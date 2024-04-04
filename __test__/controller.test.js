const bcrypt = require('bcrypt')
const profile_controller = require('../controllers/profileController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const db = require('../models/db.js');
const { query } = require('express');
const controller = require('../controllers/controller.js');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');
jest.mock('bcrypt');
/*
*   Database call order: User -> Admin -> Driver
*/

describe('Controller - get_index', () => {
    describe('get_index should render the index page with the first name of the account if there is a session', () => {
        afterEach(() => {
            jest.resetAllMocks();
         })
        test('account is a user', async () => {
            let req = {session: {id_number: 9999999}};
            let res = {render: jest.fn()};
    
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({first_name: "luis"}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await controller.get_index(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'first_name');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'first_name');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'first_name');

            expect(res.render).toHaveBeenCalledWith('index', {first_name: "luis"});
        });
        test('account is an admin', async () => {
            let req = {session: {id_number: 9999999}};
            let res = {render: jest.fn()};
    
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({first_name: "luis"}).mockResolvedValueOnce(null);

            await controller.get_index(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'first_name');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'first_name');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'first_name');

            expect(res.render).toHaveBeenCalledWith('index', {first_name: "luis"});
        });
        test('account is a driver', async () => {
            let req = {session: {id_number: 9999999}};
            let res = {render: jest.fn()};
    
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({first_name: "luis"});

            await controller.get_index(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'first_name');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'first_name');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'first_name');

            expect(res.render).toHaveBeenCalledWith('index', {first_name: "luis"});
        });
        test('there is no session', async () => {
            let req = {session: {}};
            let res = {render: jest.fn()};

            await controller.get_index(req,res);
            expect(res.render).toHaveBeenCalledWith('index', {first_name: "Login"});
        })
    })

})

describe("Controller - get_settings", () => {
    describe("get_settings should render the settings page if a session is valid ", () => {
        afterEach(() => {
            jest.resetAllMocks();
         })
        test("account is a user", async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};
            var return_obj = {
                id_number: 9999999,
                first_name: "luis",
                last_name: "razon",
                designation: "student",
                passenger_type: "student"
            }
            let response = return_obj;
            response.is_admin = false;
            response.not_driver = true;

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(return_obj).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            await controller.get_settings(req, res);
            
            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(res.render).toHaveBeenCalledWith('Settings', {"details": response});   
        });
        test("account is an admin", async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};
            var return_obj = {
                id_number: 9999999,
                first_name: "luis",
                last_name: "razon",
                designation: "student",
                passenger_type: "student"
            }
            let response = return_obj;
            response.is_admin = true;
            response.not_driver = true;

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(return_obj).mockResolvedValueOnce(null);
            await controller.get_settings(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(res.render).toHaveBeenCalledWith('Settings', {"details": response});   
        });
        test("account is a driver", async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};
            var return_obj = {
                id_number: 9999999,
                first_name: "luis",
                last_name: "razon",
                designation: "Student",
                passenger_type: "Student"
            }
            let response_driver = return_obj;
            response_driver.is_admin = false;
            response_driver.not_driver = false;
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(return_obj);
            await controller.get_settings(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number first_name last_name designation passenger_type');
            expect(res.render).toHaveBeenCalledWith('Settings', {"details": response_driver});   
        });
    });
    describe("get_settings should redirect to /Settings?id_number=9999999 if the session and query does not match", () => {
        afterEach(() => {
            jest.resetAllMocks();
         })
        test("session and query does not match", async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 1234567}};
            let res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};
            await controller.get_settings(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.redirect).toHaveBeenCalledWith('/Settings?id_number=9999999');
        });
    });
})