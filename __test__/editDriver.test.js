const bcrypt = require('bcrypt')
const profile_controller = require('../controllers/profileController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const db = require('../models/db.js');
const { query } = require('express');
const controller = require('../controllers/editDriverController.js');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');
jest.mock('bcrypt');

describe('EditDriverController - get_drivers', () => {
    describe('get_drivers should redirect to /EditDriver?id_number=9999999 if the query id_number is different from the session id_number', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });
        test('query id_number is different from session id_number', async () => {
            let req = {session: {id_number: 9999999}, query: {id_number: 8888888}};
            let res = {redirect: jest.fn()};
    
            await controller.get_drivers(req,res);
    
            expect(res.redirect).toHaveBeenCalledWith('/EditDriver?id_number=9999999');
        });
    });
    describe('get_drivers should render the EditDriver page with the list of drivers if the user is an admin', () => {
        afterEach(() => {
            jest.resetAllMocks();
         })
        test('account is an admin and query is the same as session id', async () => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};
    
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999});
            const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{first_name: "luis"}]); //what the db gets is not important, just check if it returns the expected thing
            
            await controller.get_drivers(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_many_mock).toHaveBeenCalledWith(Driver, {}, "");
            expect(res.render).toHaveBeenCalledWith('EditDriver', {result: [{first_name: "luis"}], id_number: 9999999});
        });
        test('user is not an admin', async () => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn(), status: jest.fn().mockReturnThis()};
    
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null);
            
            await controller.get_drivers(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('/');
        });
    });
});

describe('EditDriverController - delete_driver', () => {
    describe('delete_driver should delete the driver and redirect to /EditDriver?id_number=9999999', () => {
        afterEach(() => {
            jest.resetAllMocks();
         })
        test('delete driver', async () => {
            let req = {body: {d_admin_ID: 9999999, d_curr_first_name: "luis", d_curr_last_name: "luis", d_curr_email: "luis", d_curr_id_number: 9999999}};
            let res = {redirect: jest.fn()};
    
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValueOnce();
            
            await controller.delete_driver(req,res);

            expect(delete_one_mock).toHaveBeenCalledWith(Driver, {first_name: "luis", last_name: "luis", email: "luis", id_number: 9999999});
            expect(res.redirect).toHaveBeenCalledWith('/EditDriver?id_number=9999999');
        });
    });
});

describe('EditDriverController - insert_driver', () => {
    describe('insert_driver should insert the driver and redirect to /EditDriver?id_number=9999999', () => {
        afterEach(() => {
            jest.resetAllMocks();
         })
        test('insert driver', async () => {
            let req = {body: {admin_ID: 9999999, curr_first_name: "luis", curr_last_name: "luis", curr_email: "luis", curr_id_number: 9999999}};
            let res = {redirect: jest.fn()};
    
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce();
            const hash_mock = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("111111").mockResolvedValueOnce("1234");
            
            await controller.insert_driver(req,res);

            expect(insert_one_mock).toHaveBeenCalledWith(Driver, {first_name: "luis", last_name: "luis", email: "luis", id_number: 9999999, password: "111111", security_code: "1234", profile_picture: "images/profilepictures/Default.png"});
            expect(hash_mock).toHaveBeenCalledWith("111111", 10);
            expect(hash_mock).toHaveBeenCalledWith("1234", 10);
            expect(res.redirect).toHaveBeenCalledWith('/EditDriver?id_number=9999999');
        });
    });
});