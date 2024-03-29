const Reservation = require('../models/reservationdb.js');
const db = require('../models/db.js');

const scheduleController = require('../controllers/scheduleController.js');

jest.mock('../models/reservationdb.js');
jest.mock('../models/db.js');

describe('ScheduleController Functions Test', () => {
    describe('get_reservations', () => {
        test('should retrieve entry reservations based on date, location, and time', async () => {
            const req = {
                params: {
                    date: 'test',
                    location: 'test',
                    time: 'test'
                },
                query: {
                    button_clicked: 'entry'
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            
            const query = {
                date: 'test',
                entry_loc: 'test',
                entry_time: 'test'
            }
            const reservations = new Array(13).fill({
                start_campus: 'test',
                date: 'test',
                entry_loc: 'test',
                entry_time: 'test',
                exit_loc: 'test',
                exit_time: 'test',
                id_number: 123
            });

            const find_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce(reservations);
            await scheduleController.get_reservations(req, res);

            expect(find_mock).toHaveBeenCalledWith(Reservation, query);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(reservations);
        })
    })

    test('should retrieve exit reservations based on date, location, and time', async () => {
        jest.resetAllMocks();
        const req = {
            params: {
                date: 'test',
                location: 'test',
                time: 'test'
            },
            query: {
                button_clicked: 'exit'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const query = {
            date: 'test',
            exit_loc: 'test',
            exit_time: 'test'
        }
        const reservations = new Array(13).fill({
            start_campus: 'test',
            date: 'test',
            entry_loc: 'test',
            entry_time: 'test',
            exit_loc: 'test',
            exit_time: 'test',
            id_number: 123
        });

        const find_mock = jest.spyOn(db, 'find_many').mockResolvedValueOnce(reservations);

        await scheduleController.get_reservations(req, res);

        expect(find_mock).toHaveBeenCalledWith(Reservation, query)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(reservations);
    })

    test('should render an error message with status 500', async () => {
        jest.resetAllMocks();
        const req = {
            params: {
                date: 'test',
                location: 'test',
                time: 'test'
            },
            query: {
                button_clicked: 'entry'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const error = new Error('Failed to retrieve reservations');
        const find_mock = jest.spyOn(db, 'find_many').mockRejectedValueOnce(error);

        await scheduleController.get_reservations(req, res);

        expect(find_mock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve reservations' });
    })
});