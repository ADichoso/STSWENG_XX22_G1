const bcrypt = require('bcrypt')
const profile_controller = require('../controllers/profileController.js');

const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');
const Reservation = require('../models/reservationdb.js');

const db = require('../models/db.js');
const { query } = require('express');
const controller = require('../controllers/reservationController.js');

jest.mock('../models/db.js');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');
jest.mock('bcrypt');

describe('ReservationController - get_reservations', () => {
    describe('get_reservations should redirect to /Reservation?id_number=9999999 if the query id_number is different from the session id_number', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });
        test('query id_number is different from session id_number', async () => {
            let req = {session: {id_number: 9999999}, query: {id_number: 8888888}};
            let res = {redirect: jest.fn()};
    
            await controller.get_reservations(req,res);
    
            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999');
        });
    });

    describe('get_reservations should render Reservation page if session id_number is the same as query id_number', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });

         test('account is an admin', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999}).mockResolvedValueOnce(null);
            const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{first_name: "luis"}]); //output of this should not matter in this context

            await controller.get_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');
            expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: 9999999});

            expect(res.render).toHaveBeenCalledWith('Reservation', {display_UI: 1, result: [{first_name: "luis"}], id_number: 9999999, is_admin: true});
         });

        test('account is a driver', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999});
            const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{first_name: "luis"}]); //output of this should not matter in this context

            await controller.get_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');
            expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: 9999999});

            expect(res.render).toHaveBeenCalledWith('Reservation', {display_UI: 1, result: [{first_name: "luis"}], id_number: 9999999, is_admin: true});
        });

        test('account is neither an admin nor a driver', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn(), status: jest.fn().mockReturnThis()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{first_name: "luis"}]); //output of this should not matter in this context

            await controller.get_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');
            expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: 9999999});

            expect(res.render).toHaveBeenCalledWith('Reservation', {display_UI: 0, result: [{first_name: "luis"}], id_number: 9999999, is_admin: false});
        });
    });
});

describe('ReservationController - get_reservation_admin', () => {
    describe('get_reservation_admin should redirect to /ReservationAdmin?id_number=9999999 if the query id_number is different from the session id_number', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });

         test('session account is an admin', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 8888888}};
            let res = {redirect: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999}).mockResolvedValueOnce(null);

            await controller.get_reservation_admin(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');

            expect(res.redirect).toHaveBeenCalledWith('/ReservationAdmin?id_number=9999999');
         });

         test('session account is a driver', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 8888888}};
            let res = {redirect: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999});

            await controller.get_reservation_admin(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');

            expect(res.redirect).toHaveBeenCalledWith('/ReservationAdmin?id_number=9999999');
         });

        test('session account is neither an admin nor a driver; render error page', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 8888888}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await controller.get_reservation_admin(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');

            expect(res.render).toHaveBeenCalledWith('Error');
        });
    });

    describe('get_reservation_admin should render ReservationAdmin page if session id_number is the same as query id_number', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });

         test('account is an admin', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999}).mockResolvedValueOnce(null);

            await controller.get_reservation_admin(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');

            expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {id_number: 9999999});
         });

        test('account is a driver', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999});

            await controller.get_reservation_admin(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');

            expect(res.render).toHaveBeenCalledWith('ReservationAdmin',  {id_number: 9999999});
        });

        test('account is neither an admin nor a driver', async() => {
            let req = {session: {id_number: 9999999}, query: {id_number: 9999999}};
            let res = {render: jest.fn(), status: jest.fn().mockReturnThis()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await controller.get_reservation_admin(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 9999999}, 'id_number');

            expect(res.render).toHaveBeenCalledWith('Error');
        });
    });
});

describe('ReservationController - post_reservations', () => {
    describe('post_reservations should insert a reservation and redirect to /Reservation?id_number=9999999', () => {
        afterEach(() => {
            jest.resetAllMocks();
         });
        test('account is a user', async() => {
            let req = {body: {user_id_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999}).mockResolvedValueOnce(null);
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(true);

            await controller.post_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');

            expect(insert_one_mock).toHaveBeenCalledWith(Reservation, {entry_loc: "test", exit_loc: "test", date: "test", entry_time: "test", start_campus: "test", exit_time: "test", id_number: 9999999});
            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=true');
        });

        test('account is an admin', async() => {
            let req = {body: {user_id_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 9999999});
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(true);

            await controller.post_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');

            expect(insert_one_mock).toHaveBeenCalledWith(Reservation, {entry_loc: "test", exit_loc: "test", date: "test", entry_time: "test", start_campus: "test", exit_time: "test", id_number: 9999999});
            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=true');
        });
        test('account does not exist', async() => {
            let req = {body: {user_id_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

            await controller.post_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');

            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_fail=true');
        });
        test('form has no user_id_number', async() => {
            let req = {body: {user_id_number: "", hidden_ID_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(true);

            await controller.post_reservations(req,res);

            expect(insert_one_mock).toHaveBeenCalledWith(Reservation, {entry_loc: "test", exit_loc: "test", date: "test", entry_time: "test", start_campus: "test", exit_time: "test", id_number: 9999999});
            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=true');
        });

        test('form has default entry_loc', async() => {
            let req = {body: {user_id_number: "", hidden_ID_number:9999999, hidden_entry_loc: "Entry Location", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};


            await controller.post_reservations(req,res);

            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=false');
        });

        test('form has default exit_loc', async() => {
            let req = {body: {user_id_number: "", hidden_ID_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "Exit Location", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            await controller.post_reservations(req,res);

            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=false');
        });

        test('form has default entry_time', async() => {
            let req = {body: {user_id_number: "", hidden_ID_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "Entry Time", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            await controller.post_reservations(req,res);

            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=false');
        });

        test('form has default exit_time', async() => {
            let req = {body: {user_id_number: "", hidden_ID_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "Exit Time"}};
            let res = {redirect: jest.fn()};

            await controller.post_reservations(req,res);

            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=false');
        });

        test('there is an error with the insert operation', async() => {
            let req = {body: {user_id_number:9999999, hidden_entry_loc: "test", hidden_exit_loc: "test", user_date: "test", hidden_entry_time: "test", hidden_start_campus: "test", hidden_exit_time: "test"}};
            let res = {redirect: jest.fn()};

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 9999999}).mockResolvedValueOnce(null);
            const insert_one_mock = jest.spyOn(db, 'insert_one').mockResolvedValueOnce(false);

            await controller.post_reservations(req,res);

            expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 9999999}, 'id_number');
            expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 9999999}, 'id_number');

            expect(insert_one_mock).toHaveBeenCalledWith(Reservation, {entry_loc: "test", exit_loc: "test", date: "test", entry_time: "test", start_campus: "test", exit_time: "test", id_number: 9999999});
            expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=9999999&reserve_user_success=false');
        });

    });
})

describe('ReservationController - post_update_reservations', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('update reservation', async () => {
        let req = {body: {
            e_curr_start_campus: "replacement.start_campus",
            e_curr_date: "replacement.date",
            e_curr_entry_loc: "replacement.entry_loc",
            e_curr_entry_time: "replacement.entry_time",
            e_curr_exit_loc: "replacement.exit_loc",
            e_curr_exit_time: "replacement.exit_time",
            e_curr_id_number: "replacement.id_number",
            e_hidden_start_campus: "test.start_campus",
            user_date: "test.date",
            e_hidden_entry_loc: "test.entry_loc",
            e_hidden_entry_time: "test.entry_time",
            e_hidden_exit_loc: "test.exit_loc",
            e_hidden_exit_time: "test.exit_time",
            e_hidden_id_number: "test.id_number"
        }};

        let res = {redirect: jest.fn()};

        let current =  {
			start_campus: req.body.e_curr_start_campus,
			date: req.body.e_curr_date,
			entry_loc: req.body.e_curr_entry_loc,
			entry_time: req.body.e_curr_entry_time,
			exit_loc: req.body.e_curr_exit_loc,
			exit_time: req.body.e_curr_exit_time,
			id_number: req.body.e_curr_id_number
		}

        let replacement = {
			start_campus: req.body.e_hidden_start_campus,
			date: req.body.user_date,
			entry_loc: req.body.e_hidden_entry_loc,
			entry_time: req.body.e_hidden_entry_time,
			exit_loc: req.body.e_hidden_exit_loc,
			exit_time: req.body.e_hidden_exit_time,
			id_number: req.body.e_hidden_id_number
		};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: "test.id_number"}); //we dont care what this returns we just need to trigger the found flag
        const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(true);

        await controller.post_update_reservations(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(Reservation, current);

        expect(update_one_mock).toHaveBeenCalledWith(Reservation, current, replacement);
            
        expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=test.id_number&is_update_success=true');

    });

    test('reservation does not exist', async () => {
        let req = {body: {
            e_curr_start_campus: "replacement.start_campus",
            e_curr_date: "replacement.date",
            e_curr_entry_loc: "replacement.entry_loc",
            e_curr_entry_time: "replacement.entry_time",
            e_curr_exit_loc: "replacement.exit_loc",
            e_curr_exit_time: "replacement.exit_time",
            e_curr_id_number: "replacement.id_number",
            e_hidden_start_campus: "test.start_campus",
            user_date: "test.date",
            e_hidden_entry_loc: "test.entry_loc",
            e_hidden_entry_time: "test.entry_time",
            e_hidden_exit_loc: "test.exit_loc",
            e_hidden_exit_time: "test.exit_time",
            e_hidden_id_number: "test.id_number"
        }};

        let res = {redirect: jest.fn()};

        let current =  {
			start_campus: req.body.e_curr_start_campus,
			date: req.body.e_curr_date,
			entry_loc: req.body.e_curr_entry_loc,
			entry_time: req.body.e_curr_entry_time,
			exit_loc: req.body.e_curr_exit_loc,
			exit_time: req.body.e_curr_exit_time,
			id_number: req.body.e_curr_id_number
		}

        let replacement = {
			start_campus: req.body.e_hidden_start_campus,
			date: req.body.user_date,
			entry_loc: req.body.e_hidden_entry_loc,
			entry_time: req.body.e_hidden_entry_time,
			exit_loc: req.body.e_hidden_exit_loc,
			exit_time: req.body.e_hidden_exit_time,
			id_number: req.body.e_hidden_id_number
		};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null); //we dont care what this returns we just need to trigger the found flag

        await controller.post_update_reservations(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(Reservation, current);
            
        expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=test.id_number&is_update_success=false');
    });
});

describe('ReservationController - post_delete', () => {
    afterEach(() =>  {
        jest.resetAllMocks();
    });

    test('successful deletion', async () => {
        let req = {body: {d_curr_id_number: "test"}}; //we dont care what this is, we just need to trigger the delete function
        let res = {redirect: jest.fn()};

        const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValueOnce(true);

        await controller.post_delete(req,res);

        expect(delete_one_mock).toHaveBeenCalledWith(Reservation, {id_number: "test"});
        expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=test&is_delete_success=true');
    });

    test('unsuccessful deletion', async () => {
        let req = {body: {d_curr_id_number: "test"}}; //we dont care what this is, we just need to trigger the delete function
        let res = {redirect: jest.fn()};

        const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValueOnce(false);

        await controller.post_delete(req,res);

        expect(delete_one_mock).toHaveBeenCalledWith(Reservation, {id_number: "test"});
        expect(res.redirect).toHaveBeenCalledWith('/Reservation?id_number=test&is_delete_success=false');
    });
});

describe('ReservationController - get_search_user', () => {
    test('redirect to /ReservationAdmin with query id_number', async () => {
        let req = {query: {id_number: "test"}};
        let res = {redirect: jest.fn()};

        await controller.get_search_user(req,res);

        expect(res.redirect).toHaveBeenCalledWith('/ReservationAdmin?id_number=test');
    });
});

describe('ReservationController - post_search_user', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('user_id_number does not exist', async () => {
        let req = {body: {user_id_number: "user_id_number", admin_id: "admin_id"}};
        let res = {redirect: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await controller.post_search_user(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: "user_id_number"}, "id_number first_name last_name");

        expect(res.redirect).toHaveBeenCalledWith('/ReservationAdmin?id_number=admin_id&is_search_user_valid=false');
    });

    test('user_id_number is a user', async () => {
        let req = {body: {user_id_number: "user_id_number", admin_id: "admin_id"}};
        let res = {render: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: "user_id_number", first_name: "luis", last_name: "razon"}).mockResolvedValueOnce(null);
        const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{result: "result"}]); //we dont care what this returns, we just need to trigger the function

        await controller.post_search_user(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: "user_id_number"}, "");

        expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {result: [{result: "result"}], admin_id: "admin_id", selected_name: "luis razon"});
    });

    test('user_id_number is an admin', async () => {
        let req = {body: {user_id_number: "user_id_number", admin_id: "admin_id"}};
        let res = {render: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: "user_id_number", first_name: "luis", last_name: "razon"});
        const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{result: "result"}]); //we dont care what this returns, we just need to trigger the function

        await controller.post_search_user(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: "user_id_number"}, "");

        expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {result: [{result: "result"}], admin_id: "admin_id", selected_name: "luis razon"});
    });

    test('there are no reservations for an id number', async () => {
        let req = {body: {user_id_number: "user_id_number", admin_id: "admin_id"}};
        let res = {redirect: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: "user_id_number", first_name: "luis", last_name: "razon"}).mockResolvedValueOnce(null);
        const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([]); //we dont care what this returns, we just need to trigger the function

        await controller.post_search_user(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: "user_id_number"}, "id_number first_name last_name");
        expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: "user_id_number"}, "");

        expect(res.redirect).toHaveBeenCalledWith('/ReservationAdmin?id_number=admin_id&reservation_list=false');
    });
});

describe('ReservationController - post_search_user_update', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('input fields are all valid', async() => {
        let req = {body: {
            e_curr_start_campus: "replacement.start_campus",
            e_curr_date: "replacement.date",
            e_curr_entry_loc: "replacement.entry_loc",
            e_curr_entry_time: "replacement.entry_time",
            e_curr_exit_loc: "replacement.exit_loc",
            e_curr_exit_time: "replacement.exit_time",
            e_curr_id_number: "replacement.id_number",
            e_hidden_start_campus: "test.start_campus",
            user_date: "test.date",
            e_hidden_entry_loc: "test.entry_loc",
            e_hidden_entry_time: "test.entry_time",
            e_hidden_exit_loc: "test.exit_loc",
            e_hidden_exit_time: "test.exit_time",
            e_hidden_id_number: "test.id_number",
            e_admin_id: "admin_id"
        }};

        let res = {render: jest.fn()};

        let current =  {
			start_campus: req.body.e_curr_start_campus,
			date: req.body.e_curr_date,
			entry_loc: req.body.e_curr_entry_loc,
			entry_time: req.body.e_curr_entry_time,
			exit_loc: req.body.e_curr_exit_loc,
			exit_time: req.body.e_curr_exit_time,
			id_number: req.body.e_curr_id_number
		}

        let replacement = {
			start_campus: req.body.e_hidden_start_campus,
			date: req.body.user_date,
			entry_loc: req.body.e_hidden_entry_loc,
			entry_time: req.body.e_hidden_entry_time,
			exit_loc: req.body.e_hidden_exit_loc,
			exit_time: req.body.e_hidden_exit_time,
			id_number: req.body.e_hidden_id_number
		};

        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: "test.id_number"}); //we dont care what this returns we just need to trigger the found flag
        const update_one_mock = jest.spyOn(db, 'update_one').mockResolvedValueOnce(true);
        const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{result: "result"}]); //we dont care what this returns, we just need to trigger the function

        await controller.post_search_user_update(req,res);

        expect(find_one_mock).toHaveBeenCalledWith(Reservation, current);
        expect(update_one_mock).toHaveBeenCalledWith(Reservation, current, replacement);
        expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: replacement.id_number}, "-_id -__v");
            
        expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {result: [{result: "result"}], admin_id: req.body.e_admin_id, is_update_success:true});
    })

    test('input fields contain default values', async() => {
        let req = {body: {
            e_curr_start_campus: "replacement.start_campus",
            e_curr_date: "replacement.date",
            e_curr_entry_loc: "replacement.entry_loc",
            e_curr_entry_time: "replacement.entry_time",
            e_curr_exit_loc: "replacement.exit_loc",
            e_curr_exit_time: "replacement.exit_time",
            e_curr_id_number: "replacement.id_number",
            e_hidden_start_campus: "test.start_campus",
            user_date: "test.date",
            e_hidden_entry_loc: "Entry Location",
            e_hidden_entry_time: "test.entry_time",
            e_hidden_exit_loc: "test.exit_loc",
            e_hidden_exit_time: "test.exit_time",
            e_hidden_id_number: "test.id_number",
            e_admin_id: "admin_id"
        }};

        let res = {render: jest.fn()};
        let current =  {
			start_campus: req.body.e_curr_start_campus,
			date: req.body.e_curr_date,
			entry_loc: req.body.e_curr_entry_loc,
			entry_time: req.body.e_curr_entry_time,
			exit_loc: req.body.e_curr_exit_loc,
			exit_time: req.body.e_curr_exit_time,
			id_number: req.body.e_curr_id_number
		}

        let replacement = {
			start_campus: req.body.e_hidden_start_campus,
			date: req.body.user_date,
			entry_loc: req.body.e_hidden_entry_loc,
			entry_time: req.body.e_hidden_entry_time,
			exit_loc: req.body.e_hidden_exit_loc,
			exit_time: req.body.e_hidden_exit_time,
			id_number: req.body.e_hidden_id_number
		};
        
        const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{result: "result"}]); //we dont care what this returns, we just need to trigger the function

        await controller.post_search_user_update(req,res);

        expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: replacement.id_number}, "-_id -__v");
        expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {result: [{result: "result"}], admin_id: req.body.e_admin_id, is_update_success:false});
    });

    test('reservation does not exist', async () => {
        let req = {body: {
            e_curr_start_campus: "replacement.start_campus",
            e_curr_date: "replacement.date",
            e_curr_entry_loc: "replacement.entry_loc",
            e_curr_entry_time: "replacement.entry_time",
            e_curr_exit_loc: "replacement.exit_loc",
            e_curr_exit_time: "replacement.exit_time",
            e_curr_id_number: "replacement.id_number",
            e_hidden_start_campus: "test.start_campus",
            user_date: "test.date",
            e_hidden_entry_loc: "Entry Location",
            e_hidden_entry_time: "test.entry_time",
            e_hidden_exit_loc: "test.exit_loc",
            e_hidden_exit_time: "test.exit_time",
            e_hidden_id_number: "test.id_number",
            e_admin_id: "admin_id"
        }};

        let res = {render: jest.fn()};
        let current =  {
			start_campus: req.body.e_curr_start_campus,
			date: req.body.e_curr_date,
			entry_loc: req.body.e_curr_entry_loc,
			entry_time: req.body.e_curr_entry_time,
			exit_loc: req.body.e_curr_exit_loc,
			exit_time: req.body.e_curr_exit_time,
			id_number: req.body.e_curr_id_number
		}

        let replacement = {
			start_campus: req.body.e_hidden_start_campus,
			date: req.body.user_date,
			entry_loc: req.body.e_hidden_entry_loc,
			entry_time: req.body.e_hidden_entry_time,
			exit_loc: req.body.e_hidden_exit_loc,
			exit_time: req.body.e_hidden_exit_time,
			id_number: req.body.e_hidden_id_number
		};
            
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null); //we dont care what this returns we just need to trigger the found flag
    
            await controller.post_search_user_update(req,res);
    
            expect(find_one_mock).toHaveBeenCalledWith(Reservation, current);
            expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {admin_id: req.body.e_admin_id, is_update_success:false});
    });
});

describe('ReservationController - post_search_user_delete', () => {
    let req = {body: {d_curr_id_number: "test", d_admin_id: "admin_id"}}; //we dont care about the other contents, we just need to trigger the delete function
    let res = {render: jest.fn()};
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('successful deletion', async () => {
        const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValueOnce(true);
        const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce([{result: "result"}]); //we dont care what this returns, we just need to trigger the function

        await controller.post_search_user_delete(req,res);

        expect(delete_one_mock).toHaveBeenCalledWith(Reservation, {id_number: "test"});
        expect(find_many_mock).toHaveBeenCalledWith(Reservation, {id_number: "test"}, "-_id -__v");
        expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {result: [{result: "result"}], admin_id: "admin_id", is_delete_success:true});
    });

    test('unsuccessful deletion', async () => {
        const delete_one_mock = jest.spyOn(db, 'delete_one').mockResolvedValueOnce(false);

        await controller.post_search_user_delete(req,res);

        expect(delete_one_mock).toHaveBeenCalledWith(Reservation, {id_number: "test"});
        expect(res.render).toHaveBeenCalledWith('ReservationAdmin', {admin_id: "admin_id", is_delete_success:false});
    });
});