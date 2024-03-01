const profile_controller = require('../controllers/profileController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

const db = require('../models/db.js');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');

describe('profileController', () => {
    describe('get_profile', () => {
        test('should redirect user profile page with details of session user if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await profile_controller.get_profile(req, res);
            expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1 });
            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/Profile?id_number=123456789');

        })


        test('should render profile page with details of query id_number if session.id_number == query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '123456789' } };
            const res = { render: jest.fn() };
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passengerType: 'Passenger'
            }

            await profile_controller.getProfile(req, res);

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details);

            expect(find_one_mock).toBeCalledWith(User, { id_number: '123456789' }, 'id_number first_name last_name designation passenger_type profile_picture');
            
            expect(res.render).toBeCalledWith('Profile', { details: details });
        })

        test('should render the error page if an error occurs', async () => {
            const req = {session : {id_number: '123456789'}, query: { id_number: '123456789'} }
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passengerType: 'Passenger'
            }

            await profile_controller.getProfile(req, res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })


    })

    describe('get_profile_admin', () => {

        test.skip('should redirect to admin page if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details)

            await profile_controller.get_profile_admin(req,res)
            
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, {id_number: 1});
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, {id_number: 1});

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=123456789')

            
        })

        test.skip('should render the admin page with details of query id_number', async () => {})
    });

    describe('get_profile_driver', () => {
        test('should redirect to driver page if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details)

            await profile_controller.get_profile_driver(req,res)

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: '123456789'}, {id_number: 1})
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: '123456789'}, {id_number: 1})
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: '123456789'}, {id_number: 1})

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?id_number=123456789')
        })

        test('should render profile page with details of query id_number if session.id_number == query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '123456789'} }
            const res = { render: jest.fn() }
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            await profile_controller.get_profile_driver(req,res)

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details)

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: '123456789'}, 'id_number first_name last_name designation passenger_type profile_picture')
            expect(res.render).toBeCalledWith('Profile', {details: details})
        })

        test('should render the error page if an error occurs', async () => {
            const req = {session: {id_number: '123456789'}, query: {id_number: '123456789'}}
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            await profile_controller.get_profile_driver(req,res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        });
    }); 
            
            
})