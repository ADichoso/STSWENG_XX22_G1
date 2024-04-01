const db = require('../models/db.js');
const User = require('../models/userdb.js');
const Reservation = require('../models/reservationdb.js');

const searchController = require('../controllers/searchController.js');


jest.mock('../models/userdb.js');
jest.mock('../models/reservationdb.js');
jest.mock('../models/db.js');

describe('SearchController Functions Test', () => {
    describe('get_search', () => {
        test('should render the Search page', () => {
            const res = {
                render: jest.fn()
            }
            const req = {};

            searchController.get_search(req, res);

            expect(res.render).toHaveBeenCalledWith('Search', res);
        })
    })

    describe('post_user_search', () => {
        test('should search for a user based on the payload', async () => {
            jest.resetAllMocks();
            const req = {
                body: {
                    payload: 'test'
                }
            }
            const res = {
                send: jest.fn()
            }

            const result = {
                first_name: 'test',
                last_bame: 'test',
                passenger_type: 'test',
                id_number: 123,
                profile_picture: 'test'
            }

            const search_mock = jest.spyOn(User, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(new Array(10).fill({result}))
            });

            await searchController.post_user_search(req, res);

            expect(search_mock).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({payload: new Array(10).fill({result})});
        })
    })

    describe('get_search_profile', () => {
        test('should render a user profile ', async () => {
            jest.resetAllMocks();
            const req = {
                query: {
                    idNumber: 123
                }
            }

            const res = {
                render: jest.fn()
            }

            const result = {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
                profile_picture: 'test'
            }
            const details = {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
                profile_picture: "images/profilepictures/Default.png"
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(result);

            await searchController.get_search_profile(req, res);

            expect(find_one_mock).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('SearchProfile', {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
                profile_picture: "images/profilepictures/Default.png"
            });
        })

        test('should render an error page if a single user is not found', async () => {
            jest.resetAllMocks();
            const req = {
                query: {
                    idNumber: 123
                }
            }

            const res = {
                render: jest.fn()
            }

            const result = null;

            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(result);

            await searchController.get_search_profile(req, res);

            expect(find_one_mock).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('Error', res);
        })

        test('should use result.profile_picture if it is not null or Default.png', async () => {
            jest.resetAllMocks();
            const req = {
                query: {
                    idNumber: 123
                }
            }

            const res = {
                render: jest.fn()
            }

            const result = {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
                profilePicture: 'test'
            }
            const details = {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
                profile_picture: 'test'
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(result);

            await searchController.get_search_profile(req, res);

            expect(find_one_mock).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('SearchProfile', details);
        })

        test('should use Default.png if result.profile_picture is undefined', async () => {
            jest.resetAllMocks();
            const req = {
                query: {
                    idNumber: 123
                }
            }

            const res = {
                render: jest.fn()
            }

            const result = {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
            }
            const details = {
                id_number: 123,
                first_name: 'test',
                last_name: 'test',
                designation: 'test',
                passenger_type: 'test',
                profile_picture: "images/profilepictures/Default.png"
            }
            const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(result);

            await searchController.get_search_profile(req, res);

            expect(find_one_mock).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('SearchProfile', details);
        })
    })

    describe('get_search_reservation', () => {
        test('should render a reservation', async () => {
            jest.resetAllMocks();
            const req = {
                query: {
                    idNumber: 123
                }
            }

            const res = {
                render: jest.fn()
            }

            const result = [
                {
                    start_campus: 'test',
                    date: 'test',
                    entry_loc: 'test',
                    entry_time: 'test',
                    exit_loc: 'test',
                    exit_time: 'test',
                    id_number: 123
                },
                {
                    start_campus: 'test',
                    date: 'test',
                    entry_loc: 'test',
                    entry_time: 'test',
                    exit_loc: 'test',
                    exit_time: 'test',
                    id_number: 123
                }
            ]

            const find_many_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce(result);

            await searchController.get_search_reservation(req, res);

            expect(find_many_mock).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('SearchReservation', {result: result, id_number: 123});

        });
    })
})


