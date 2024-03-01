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
    describe('getProfile', () => {
        test('should render profile page with details of session user if session.id_number != query.id_number', () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '123456789' } };
            const res = { render: jest.fn() };
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passengerType: 'Passenger'
            }

            User.getProfile.mockResolvedValue(details);
            profile_controller.getProfile(req, res);
            expect(User.getProfile).toBeCalledWith('123456789');
            expect(res.render).toBeCalledWith('profile', { details: details });

        })

        test('should render profile page with details of query id_number if session.id_number == query.id_number', () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '123456789' } };
            const res = { render: jest.fn() };
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passengerType: 'Passenger'
            }

            User.getProfile.mockResolvedValue(details);
            profile_controller.getProfile(req, res);
            expect(User.getProfile).toBeCalledWith('123456789');
            expect(res.render).toBeCalledWith('profile', { details: details });
        })
    })
})