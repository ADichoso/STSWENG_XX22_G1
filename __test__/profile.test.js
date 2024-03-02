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

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details);

            await profile_controller.getProfile(req, res);

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

        test('should redirect to admin page if session.id_number != query.id_number', async () => {
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

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details)

            await profile_controller.get_profile_driver(req,res)

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
    
    describe('post_change_public_info', () => {
        test('user changes first name and last name', async () => {
            const req = { query: {id_number : '123456789'}, body: {new_first_name: "Josh", new_last_name: "Natividad"} };
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };

            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, req.query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(User, req.query, req.body);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/Profile?id_number=123456789&infoChangeSuccess=true`);
        })

        test('admin changes first name and last name', async () => {
            const req = { query: {id_number : '000000000'}, body: {new_first_name: "Josh", new_last_name: "Natividad"} };
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '000000000',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, req.query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Admin, req.query, req.body);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileAdmin?id_number=000000000&infoChangeSuccess=true`);
        })

        test('driver changes first name and last name', async () => {
            const req = { query: {id_number : '000000000'}, body: {new_first_name: "Josh", new_last_name: "Natividad"} };
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '000000000',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(Driver, req.query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Driver, req.query, req.body);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileDriver?id_number=000000000&infoChangeSuccess=true`);
        });

        test('user changes profile picture', async () => {
            const req = { query: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };

            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, req.query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(User, req.query, req.body);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/Profile?id_number=123456789&infoChangeSuccess=true`);

        })

        test('admin changes profile picture', async () => {
            const req = { query: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };

            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, req.query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Admin, req.query, req.body);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileAdmin?id_number=123456789&infoChangeSuccess=true`);
        });

        test('driver changes profile picture', async () => {
            const req = { query: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };

            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(Driver, req.query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Driver, req.query, req.body);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileDriver?id_number=123456789&infoChangeSuccess=true`);
        });

        test('should render the error page if an error occurs', async () => {
            const req = { query: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };

            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }

            await profile_controller.post_change_public_info(req, res);

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        });
    });
    
})