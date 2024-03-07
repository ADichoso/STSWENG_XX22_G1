const bcrypt = require('bcrypt')
const profile_controller = require('../controllers/profileController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const db = require('../models/db.js');
const { query } = require('express');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');
jest.mock('bcrypt');

describe('profileController', () => {
    describe('get_profile', () => {
        test('should redirect user profile page with details of session user if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await profile_controller.get_profile(req, res);
            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/Profile?id_number=123456789');

        })

        test('should redirect admin profile page with details of session admin if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);

            await profile_controller.get_profile(req, res);
            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=123456789');

        })

        test('should redirect driver profile page with details of session driver if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);

            await profile_controller.get_profile(req, res);
            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);
            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/ProfileDriver?id_number=123456789');

        })
        test('should render profile page with details of query id_number if session.id_number == query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: { id_number: '123456789' } };
            const res = { render: jest.fn() };
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details);

            await profile_controller.get_profile(req, res);

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
                passenger_type: 'Passenger'
            }

            await profile_controller.get_profile(req, res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })


    })

    describe('get_profile_admin', () => {

        test('should redirect to admin page if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details)

            await profile_controller.get_profile_admin(req,res)
            
            expect(find_one_mock).toBeCalledWith(User, query, projection);
            expect(find_one_mock).toBeCalledWith(Admin, query, projection);

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=123456789')
        })
        test('should redirect to user page if session.id_number != query.id_number and session id is a user', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { id_number: '123456789' }
            const projection = 'id_number'

            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null)

            await profile_controller.get_profile_admin(req,res)
            
            expect(find_one_mock).toBeCalledWith(User, query, projection);
            expect(find_one_mock).toBeCalledWith(Admin, query, projection);

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/Profile?id_number=123456789')
        })
        test('should redirect to driver page if session.id_number != query.id_number and session id is a driver', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details)

            await profile_controller.get_profile_admin(req,res)
            
            expect(find_one_mock).toBeCalledWith(User, query, projection);
            expect(find_one_mock).toBeCalledWith(Admin, query, projection);
            expect(find_one_mock).toBeCalledWith(Driver, query, projection);

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?id_number=123456789')
        })
        test('should render users profile page with details of query id_number if session.id_number == query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '123456789'} }
            const res = { status: jest.fn().mockReturnThis(), render: jest.fn() }
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }
            
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details)

            await profile_controller.get_profile_admin(req, res)

            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, 'id_number first_name last_name designation passenger_type profile_picture')
            expect(res.render).toBeCalledWith('ProfileAdmin', {details: details})
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

            await profile_controller.get_profile_admin(req,res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })
    });

    describe('get_profile_driver', () => {
        
        test('should redirect to driver page if session.id_number != query.id_number', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details)

            await profile_controller.get_profile_driver(req,res)

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection)
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection)
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?id_number=123456789')
        })
        test('should redirect to user page if session.id_number != query.id_number and session is a user', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null)

            await profile_controller.get_profile_driver(req,res)

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection)
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection)
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/Profile?id_number=123456789')
        })
        test('should redirect to admin page if session.id_number != query.id_number and session is a admin', async () => {
            const req = { session: { id_number: '123456789' }, query: {id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { id_number: '123456789' }
            const projection = 'id_number'
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null)

            await profile_controller.get_profile_driver(req,res)

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection)
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection)
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=123456789')
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

            expect(find_one_mock).toHaveBeenCalledWith(Driver , {id_number: '123456789'}, 'id_number first_name last_name designation passenger_type profile_picture')
            expect(res.render).toBeCalledWith('ProfileDriver', {details: details})
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
            const req = { body: {id_number : '123456789', new_first_name: "Josh", new_last_name: "Natividad"}};
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {id_number: req.body.id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(User, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/Profile?id_number=123456789&info_change_success=true`);
        })

        test('admin changes first name and last name', async () => {
            const req = {body: {id_number : '000000000',new_first_name: "Josh", new_last_name: "Natividad"} };
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '000000000',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {id_number: req.body.id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Admin, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileAdmin?id_number=000000000&info_change_success=true`);
        })

        test('driver changes first name and last name', async () => {
            const req = { body: {id_number : '000000000', new_first_name: "Josh", new_last_name: "Natividad"}};
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
            const query = {id_number: req.body.id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);
            
            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'id_number first_name last_name designation passenger_type profile_picture');

            expect(update_one_mock).toHaveBeenCalledWith(Driver, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileDriver?id_number=000000000&info_change_success=true`);
        });

        test('user changes profile picture', async () => {
            const req = { body: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
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
            const query = {id_number: req.body.id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(User, query, {profilePicture: "images/profilepictures/" + req.body.id_number + ".png"});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/Profile?id_number=123456789&info_change_success=true`);

        })

        test('admin changes profile picture', async () => {
            const req = { body: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {id_number: req.body.id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig
            
            await profile_controller.post_change_public_info(req, res);
            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Admin, query, {profilePicture: "images/profilepictures/" + req.body.id_number + ".png"});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileAdmin?id_number=123456789&info_change_success=true`);
        });

        test('driver changes profile picture', async () => {
            const req = { body: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {id_number: req.body.id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'id_number first_name last_name designation passenger_type profile_picture');
           
            expect(update_one_mock).toHaveBeenCalledWith(Driver, query, {profilePicture: "images/profilepictures/" + req.body.id_number + ".png"});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileDriver?id_number=123456789&info_change_success=true`);
        });

        test('should render the error page if an error occurs', async () => {
            const req = { body: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
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

        test('should redirect to setting page if info change has not been successful', async() => {
            const req = { body: {id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {id_number: req.body.id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null); //easiest method to reach unsuccessful state; not really how it should happen

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'id_number first_name last_name designation passenger_type profile_picture');

            expect(res.redirect).toBeCalledWith(`/Settings?id_number=123456789&info_change_success=true`);
        });

        
    });
    
    describe('post_change_private_info', () => {
        const req = {body: {id_number: "123456789", designation: "Faculty"}}
        const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis};
        const details = {
            id_number: '123456789',
            first_name: 'Austin',
            last_name: 'Tester',
            designation: 'Designation',
            passenger_type: 'Passenger'
        };
        const query = {id_number: req.body.id_number};
        const projection = "id_number designation";
        test('should change designation of a Student in the database then redirect to /Profile', async () => {
            //Only two since there wouldnt be a case where we would check for driver in here unless this function changes something else apart from designation in the future
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null); 

            await profile_controller.post_change_private_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/Profile?id_number=' + req.body.id_number + '&info_change_success=true');
        });

        test('should change designation of an Admin in the database then redirect to /ProfileAdmin', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            await profile_controller.post_change_private_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=' + req.body.id_number + '&info_change_success=true');
        });
        
        test('should redirect to settings page if info change has not been successful', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null); //easiest method to reach unsuccessful state; not really how it should happen

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'id_number first_name last_name designation passenger_type profile_picture');

            expect(res.redirect).toBeCalledWith('/Settings?id_number=' + req.body.id_number + '&info_change_success=false');
        });
        
    })

    describe('post_change_password', () => {
        const req = {body: {id_number: '123456789'}, new_password: 'hello_world'}
        test("should change a user's password if the old password is correct", async () => {
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const resultUser = {
                id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(resultUser)

            await profile_controller.post_change_password(req, res)

            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, { id_number: 1, password: 1 })
            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/Profile?id_number=123456789&pw_change_success=true')
        })

        test("should change an admin's password if the old password is correct", async () => {
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const resultAdmin = {
                id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(resultAdmin)
            const projection = 'id_number password'
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=123456789&pw_change_success=true')
        })

        test("should change the driver's password if the old password is correct", async () => {
            const res  = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const resultDriver = {
                id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(resultDriver)

            await profile_controller.post_change_password(req, res)
            const projection = 'id_number password'
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?id_number=123456789&pw_change_success=true')
        })

        test("should render the error page if an error occurs", async () => {
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}
            const result = {
                id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null)

            await profile_controller.post_change_password(req, res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })

        test("should redirect to the settings page if the action is unsuccessful", async () => {
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const result = {
                id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null)
            const projection = 'id_number password'
            await profile_controller.post_change_password(req, res)

            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {id_number: '123456789'}, projection)

            
            expect(res.redirect).toBeCalledWith('/Settings?id_number=123456789&pw_change_success=true')
        })

    })

    describe('post_change_code', () =>{
        const req = {body: {id_number: '123456789', new_code: '1234'}}
        const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
        const projection = 'id_number code'
        
        
        test("should change the user's code if the old code is correct", async () => {
            const db_result = { id_number: '123456789', code: '4321' }
            const find_one_mock = jest.spyOn(db, 'find_one')
            find_one_mock.mockResolvedValueOnce(db_result).
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/Profile?id_number=123456789&code_change_success=true')
        })

        test("should change the admin's code if the old code is correct", async () => {
            const db_result = { id_number: '123456789', code: '4321' }
            const find_one_mock = jest.spyOn(db, 'find_one')
            find_one_mock.mockResolvedValueOnce(null).mockResolvedValueOnce(db_result)
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?id_number=123456789&code_change_success=true')
        })

        test("should change the driver's code if the old code is correct", async () => {
            const db_result = { id_number: '123456789', code: '4321' }
            const find_one_mock = jest.spyOn(db, 'find_one')
            find_one_mock.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(db_result)
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?id_number=123456789&code_change_success=true')
        })

        test("should render the error page if an error occurs", async () => {
            const find_one_mock = jest.spyOn(db, 'find_one')
            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })

        test("should redirect to the settings page if the action is unsuccessful", async () => {
            const find_one_mock = jest.spyOn(db, 'find_one')
            find_one_mock.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null)
            expect(find_one_mock).toBeCalledWith(User, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {id_number: '123456789'}, projection)

            expect(res.redirect).toBeCalledWith('/Settings?id_number=123456789&code_change_success=false')
        })
    })

    describe('post_delete_account', () => {
        const req = {body: {id_number: "123456789", password: "abcde12345"}, session : {destroy: jest.fn()}}
        const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis, render: jest.fn()};
        const details = {
            id_number: '123456789',
            password: 'hashed_password'
        };
        const query = {id_number: req.body.id_number};
        const projection = "id_number password";
        const delete_return = {
            acknowledged: true,
            deletedCount: 1
        }
        test('user deleting account', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValue(delete_return);
            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(delete_one_mock).toHaveBeenCalled(User, query);
            expect(delete_one_mock).toHaveBeenCalled(Reservation, query);

            expect(req.session.destroy).toBeCalled();
            expect(res.render).toBeCalledWith('index', {first_name: 'Login'});
        })
        
        test('admin deleting account', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValue(delete_return);
            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(delete_one_mock).toHaveBeenCalled(Admin, query);
            expect(delete_one_mock).toHaveBeenCalled(Reservation, query);

            expect(req.session.destroy).toBeCalled();
            expect(res.render).toBeCalledWith('index', {first_name: 'Login'});
        })

        test('driver deleting account', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValue(delete_return);

            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(delete_one_mock).toHaveBeenCalled(Driver, query);
            it.todo("Edit driver deleting account test when driver has other databases that would be impacted, for now only instances in driver db will be deleted");

            expect(req.session.destroy).toBeCalled();
            expect(res.render).toBeCalledWith('index', {first_name: 'Login'});
        });

        test('reload the page when an error occurs', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null);

            find_one_mock.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null)
            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(res.redirect).toBeCalledWith('/Settings?id_number=123456789&code_change_success=false')
        })

    })

    describe('get_logout', () => {
        test('should destroy the session and redirect to /', async () => {
            const req = {session: {destroy: jest.fn()}}
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}

            await profile_controller.get_logout(req, res)

            expect(req.session.destroy).toBeCalled()
            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/')
        })

        test('should render the error page if an error occurs', async () => {
            const req = {session: {destroy: jest.fn()}}
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}

            await profile_controller.get_logout(req, res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })
    })
})