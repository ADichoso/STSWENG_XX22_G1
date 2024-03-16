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
        test('should redirect user profile page with details of session user if session.user_id_number != query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: { user_id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await profile_controller.get_profile(req, res);
            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/Profile?user_id_number=123456789');

        })

        test('should redirect admin profile page with details of session admin if session.user_id_number != query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: { user_id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?user_id_number=123456789');

        })

        test('should redirect driver profile page with details of session driver if session.user_id_number != query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: { user_id_number: '000000000' } };
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/ProfileDriver?user_id_number=123456789');

        })
        test('should render profile page with details of query user_id_number if session.user_id_number == query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: { user_id_number: '123456789' } };
            const res = { render: jest.fn() };
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details);

            await profile_controller.get_profile(req, res);

            expect(find_one_mock).toBeCalledWith(User, { user_id_number: '123456789' }, 'user_id_number first_name last_name designation passenger_type profile_picture');
            
            expect(res.render).toBeCalledWith('Profile', { details: details });
        })

        test('should render the error page if an error occurs', async () => {
            const req = {session : {user_id_number: '123456789'}, query: { user_id_number: '123456789'} }
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}
            const details = {
                user_id_number: '123456789',
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

        test('should redirect to admin page if session.user_id_number != query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?user_id_number=123456789')
        })
        test('should redirect to user page if session.user_id_number != query.user_id_number and session id is a user', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'

            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/Profile?user_id_number=123456789')
        })
        test('should redirect to driver page if session.user_id_number != query.user_id_number and session id is a driver', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '321'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/ProfileDriver?user_id_number=123456789')
        })
        test('should render users profile page with details of query user_id_number if session.user_id_number == query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '123456789'} }
            const res = { status: jest.fn().mockReturnThis(), render: jest.fn() }
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }
            
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details)

            await profile_controller.get_profile_admin(req, res)

            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, 'user_id_number first_name last_name designation passenger_type profile_picture')
            expect(res.render).toBeCalledWith('ProfileAdmin', {details: details})
        })

        test('should render the error page if an error occurs', async () => {
            const req = {session: {user_id_number: '123456789'}, query: {user_id_number: '123456789'}}
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}
            const details = {
                user_id_number: '123456789',
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
        
        test('should redirect to driver page if session.user_id_number != query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/ProfileDriver?user_id_number=123456789')
        })
        test('should redirect to user page if session.user_id_number != query.user_id_number and session is a user', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/Profile?user_id_number=123456789')
        })
        test('should redirect to admin page if session.user_id_number != query.user_id_number and session is a admin', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '000000000'} }
            const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn()}
            const query = { user_id_number: '123456789' }
            const projection = 'user_id_number'
            const details = {
                user_id_number: '123456789',
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
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?user_id_number=123456789')
        })
        test('should render profile page with details of query user_id_number if session.user_id_number == query.user_id_number', async () => {
            const req = { session: { user_id_number: '123456789' }, query: {user_id_number: '123456789'} }
            const res = { render: jest.fn() }
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details)

            await profile_controller.get_profile_driver(req,res)

            expect(find_one_mock).toHaveBeenCalledWith(Driver , {user_id_number: '123456789'}, 'user_id_number first_name last_name designation passenger_type profile_picture')
            expect(res.render).toBeCalledWith('ProfileDriver', {details: details})
        })

        test('should render the error page if an error occurs', async () => {
            const req = {session: {user_id_number: '123456789'}, query: {user_id_number: '123456789'}}
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}
            const details = {
                user_id_number: '123456789',
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
            const req = { body: {user_id_number : '123456789', new_first_name: "Josh", new_last_name: "Natividad"}};
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {user_id_number: req.body.user_id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(User, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/Profile?user_id_number=123456789&info_change_success=true`);
        })

        test('admin changes first name and last name', async () => {
            const req = {body: {user_id_number : '000000000',new_first_name: "Josh", new_last_name: "Natividad"} };
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '000000000',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {user_id_number: req.body.user_id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            };

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Admin, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileAdmin?user_id_number=000000000&info_change_success=true`);
        })

        test('driver changes first name and last name', async () => {
            const req = { body: {user_id_number : '11111111', new_first_name: "Josh", new_last_name: "Natividad"}};
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '11111111',
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
            const query = {user_id_number: req.body.user_id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags) //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_public_info(req, res);
            
            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'user_id_number first_name last_name designation passenger_type profile_picture');

            expect(update_one_mock).toHaveBeenCalledWith(Driver, query, {first_name: req.body.new_first_name, last_name: req.body.new_last_name});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileDriver?user_id_number=11111111&info_change_success=true`);
        });

        test('should render the error page if an error occurs', async () => {
            const req = { body: {user_id_number : '123456789'}}; //im not sure how original_name works so im just gonna set it to id
            const res = { render: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789',
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

            expect(res.status).toBeCalledWith(500);
            expect(res.render).toBeCalledWith('Error', res);
        });

        test('should redirect to setting page if info change has not been successful', async () => {
            const req = { body: {user_id_number : '123456789'}}; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {user_id_number: req.body.user_id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null); //easiest method to reach unsuccessful state; not really how it should happen

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'user_id_number first_name last_name designation passenger_type profile_picture');

            expect(res.redirect).toBeCalledWith(`/Settings?user_id_number=123456789&info_change_success=false`); //DAPAT FALSE
        });
    });
    
    describe('post_change_profile_picture', () => {
        test('user changes profile picture', async () => { //Move this to post_change_profile_picture Please:  Aaron
            const req = { body: {user_id_number : '123456789'}, file: {original_name: "lmao.png"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789',
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
            const query = {user_id_number: req.body.user_id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(update_one_flags).mockResolvedValueOnce(null).mockResolvedValueOnce(null); //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_profile_picture(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(User, query, {profile_picture: "images/profilepictures/" + req.body.user_id_number + ".png"});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/Profile?user_id_number=123456789&info_change_success=true`);

        });

        test('admin changes profile picture', async () => {
            const req = { body: {user_id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789'
            };
            const query = {user_id_number: req.body.user_id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(null).mockResolvedValueOnce(update_one_flags).mockResolvedValueOnce(null); //im not sure if this is necessary lmao just remove if it isnt ig
            
            await profile_controller.post_change_profile_picture(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number profile_picture');
            expect(update_one_mock).toHaveBeenCalledWith(Admin, query, {profile_picture: "images/profilepictures/" + req.body.user_id_number + ".png"});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileAdmin?user_id_number=123456789&info_change_success=true`);
        });

        test('driver changes profile picture', async () => {
            const req = { body: {user_id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {user_id_number: req.body.user_id_number};
            //Simulating update_one return flags
            const update_one_flags = {
                n: 1,
                nModified: 1, 
                ok: 1
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(update_one_flags); //im not sure if this is necessary lmao just remove if it isnt ig

            await profile_controller.post_change_profile_picture(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'user_id_number profile_picture');
           
            expect(update_one_mock).toHaveBeenCalledWith(Driver, query, {profile_picture: "images/profilepictures/" + req.body.user_id_number + ".png"});

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith(`/ProfileDriver?user_id_number=123456789&info_change_success=true`);
        });

        test('should render the error page if an error occurs', async () => {
            const req = { body: {user_id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { render: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)

            await profile_controller.post_change_profile_picture(req, res);

            expect(res.status).toBeCalledWith(500);
            expect(res.render).toBeCalledWith('Error', res);
        });

        test('should redirect to setting page if info change has not been successful', async () => {
            const req = { body: {user_id_number : '123456789'}, file: {original_name: "123456789"} }; //im not sure how original_name works so im just gonna set it to id
            const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis()} //status is added here for formality (since all the previous ones had status for redirects)
            const details = {
                user_id_number: '123456789',
                first_name: 'Austin',
                last_name: 'Tester',
                designation: 'Designation',
                passenger_type: 'Passenger'
            };
            const query = {user_id_number: req.body.user_id_number};
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null); //easiest method to reach unsuccessful state; not really how it should happen

            await profile_controller.post_change_profile_picture(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, 'user_id_number profile_picture');

            expect(res.redirect).toBeCalledWith(`/Settings?user_id_number=123456789&info_change_success=false`); //Dapat False
        });

        
    });

    describe('post_change_private_info', () => {
        const req = {body: {user_id_number: "123456789", designation: "Faculty"}}
        const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()};
        const details = {
            user_id_number: '123456789',
            first_name: 'Austin',
            last_name: 'Tester',
            designation: 'Designation',
            passenger_type: 'Passenger'
        };
        const query = {user_id_number: req.body.user_id_number};
        const projection = "user_id_number designation";
        test('should change designation of a Student in the database then redirect to /Profile', async () => {
            //Only two since there wouldnt be a case where we would check for driver in here unless this function changes something else apart from designation in the future
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null); 

            await profile_controller.post_change_private_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/Profile?user_id_number=' + req.body.user_id_number + '&info_change_success=true');
        });

        test('should change designation of an Admin in the database then redirect to /ProfileAdmin', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            await profile_controller.post_change_private_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);

            expect(res.status).toBeCalledWith(200);
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?user_id_number=' + req.body.user_id_number + '&info_change_success=true');
        });
        
        test('should redirect to settings page if info change has not been successful', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null); //easiest method to reach unsuccessful state; not really how it should happen

            await profile_controller.post_change_public_info(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, 'user_id_number first_name last_name designation passenger_type profile_picture');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, 'user_id_number first_name last_name designation passenger_type profile_picture');

            expect(res.redirect).toBeCalledWith('/Settings?user_id_number=' + req.body.user_id_number + '&info_change_success=false');
        });
        
    })

    describe('post_change_password', () => {
        const req = {body: {user_id_number: '123456789', current_password: 'goodbye_world'}, new_password: 'hello_world'}
        
        test("should change a user's password if the old password is correct", async () => {
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const resultUser = {
                user_id_number: '123456789',
                password: 'goodbye_world'
            }
            const projection = 'user_id_number password'

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(resultUser)

            bcrypt.compare.mockResolvedValueOnce(true);

            await profile_controller.post_change_password(req, res)

            
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/Profile?user_id_number=123456789&pw_change_success=true')
        })

        test("should change an admin's password if the old password is correct", async () => {
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const resultAdmin = {
                user_id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(resultAdmin)
            const projection = 'user_id_number password'

            bcrypt.compare.mockResolvedValueOnce(true);

            await profile_controller.post_change_password(req, res)

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, projection)
            
            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?user_id_number=123456789&pw_change_success=true')
        })

        test("should change the driver's password if the old password is correct", async () => {
            const res  = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const resultDriver = {
                user_id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(resultDriver);
            const projection = 'user_id_number password'

            bcrypt.compare.mockResolvedValueOnce(true);
            await profile_controller.post_change_password(req, res);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {user_id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?user_id_number=123456789&pw_change_success=true')
        })

        test("should render the error page if an error occurs", async () => {
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}

            await profile_controller.post_change_password(req, res)

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })

        test("should redirect to the settings page if the action is unsuccessful", async () => {
            const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis()}
            const result = {
                user_id_number: '123456789',
                password: 'goodbye_world'
            }

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null)
            const projection = 'user_id_number password'
            await profile_controller.post_change_password(req, res)

            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {user_id_number: '123456789'}, projection)

            
            expect(res.redirect).toBeCalledWith('/Settings?user_id_number=123456789&pw_change_success=false')
        })

    })

    describe('post_change_code', () =>{
        const req = {body: {user_id_number: '123456789', current_sec_code: '4321', new_sec_code: '1234'}}
        const res = {render: jest.fn(), redirect: jest.fn(), status: jest.fn().mockReturnThis()}
        const projection = 'user_id_number security_code'
        
        
        test("should change the user's code if the old code is correct", async () => {
            const db_result = { user_id_number: '123456789', code: '4321' }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(db_result);
            bcrypt.compare.mockResolvedValueOnce(true);


            await profile_controller.post_change_code(req, res);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/Profile?user_id_number=123456789&code_change_success=true')
        })

        test("should change the admin's code if the old code is correct", async () => {
            const db_result = { user_id_number: '123456789', code: '4321' }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(db_result);
            bcrypt.compare.mockResolvedValueOnce(true);

            await profile_controller.post_change_code(req, res);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileAdmin?user_id_number=123456789&code_change_success=true')
        })

        test("should change the driver's code if the old code is correct", async () => {
            const db_result = { user_id_number: '123456789', code: '4321' }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(db_result);
            bcrypt.compare.mockResolvedValueOnce(true);

            await profile_controller.post_change_code(req, res);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {user_id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(200)
            expect(res.redirect).toBeCalledWith('/ProfileDriver?user_id_number=123456789&code_change_success=true')
        })

        test("should render the error page if an error occurs", async () => {
            const res = {render: jest.fn(), status: jest.fn().mockReturnThis()}

            await profile_controller.post_change_code(req, res);

            expect(res.status).toBeCalledWith(500)
            expect(res.render).toBeCalledWith('Error', res)
        })

        test("should redirect to the settings page if the action is unsuccessful", async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            bcrypt.compare.mockResolvedValueOnce(true);

            await profile_controller.post_change_code(req, res);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(find_one_mock).toBeCalledWith(User, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Admin, {user_id_number: '123456789'}, projection)
            expect(find_one_mock).toBeCalledWith(Driver, {user_id_number: '123456789'}, projection)

            expect(res.status).toBeCalledWith(500)
            expect(res.redirect).toBeCalledWith('/Settings?user_id_number=123456789&code_change_success=false')
        })
    })

    describe('post_delete_account', () => {
        const req = {body: {user_id_number: "123456789", password: "abcde12345"}, session : {destroy: jest.fn()}}
        const res = {redirect: jest.fn(), status: jest.fn().mockReturnThis(), render: jest.fn()};
        const details = {
            user_id_number: '123456789',
            password: 'abcde12345'
        };
        const query = {user_id_number: req.body.user_id_number};
        const projection = "user_id_number password";
        const delete_return = {
            acknowledged: true,
            deletedCount: 1
        }
        test('user deleting account', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(details).mockResolvedValueOnce(null);
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValue(delete_return);
            const delete_many_mock = jest.spyOn(db, 'delete_many').mockResolvedValue(delete_return);
            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(delete_one_mock).toHaveBeenCalledWith(User, query);
            expect(delete_many_mock).toHaveBeenCalledWith(Reservation, query);

            expect(req.session.destroy).toBeCalled();
            expect(res.render).toBeCalledWith('index', {first_name: 'Login'});
        })
        
        test('admin deleting account', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValue(delete_return);
            const delete_many_mock = jest.spyOn(db, 'delete_many').mockResolvedValue(delete_return);
            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(delete_one_mock).toHaveBeenCalledWith(Admin, query);
            expect(delete_many_mock).toHaveBeenCalledWith(Reservation, query);

            expect(req.session.destroy).toBeCalled();
            expect(res.render).toBeCalledWith('index', {first_name: 'Login'});
        })

        test('driver deleting account', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(details);
            const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValue(delete_return);
            const delete_many_mock = jest.spyOn(db, 'delete_many').mockResolvedValue(delete_return);

            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            expect(delete_one_mock).toHaveBeenCalledWith(Driver, query);
            expect(delete_many_mock).toHaveBeenCalledWith(Reservation, query);

            expect(req.session.destroy).toBeCalled();
            expect(res.render).toBeCalledWith('index', {first_name: 'Login'});
        });

        test('reload the page when an error occurs', async () => {
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            bcrypt.compare.mockResolvedValue(true);

            await profile_controller.post_delete_account(req, res);

            expect(find_one_mock).toHaveBeenCalledWith(User, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Admin, query, projection);
            expect(find_one_mock).toHaveBeenCalledWith(Driver, query, projection);

            expect(bcrypt.compare).toHaveBeenCalled();
            
            expect(res.status).toBeCalledWith(500);
            expect(res.redirect).toBeCalledWith('/Settings?user_id_number=123456789&delete_success=false')
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
        });
    })
})