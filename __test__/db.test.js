const { default: mongoose } = require('mongoose');
const { find_one } = require('../models/db.js');
const db = require('../models/db.js');

describe('Database Functions Test', () => {
    describe('connect', () => {
        test('should connect to the database', async () => {
            const url = 'mongodb+srv://MauriesLopez:679914164@shuttlereservation.nagtzpm.mongodb.net/?retryWrites=true&w=majority'
            const options = {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }; 
            
            const connect_mock = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce(true);
            
            await db.connect();

            expect(connect_mock).toHaveBeenCalledWith(url, options);

        })
    })

    describe('insert_one', () => {
        test('should insert a single `doc` to the database', async () => {
            const model = {create : jest.fn()};
            const doc = {};

            const insert_one_mock = jest.spyOn(db, 'insert_one')

            await db.insert_one(model, doc);

            expect(insert_one_mock).toHaveBeenCalledWith(model, doc);
        })
    })

    describe('insert_many', () => {
        test('should insert multiple `docs` to the database', async () => {
            const model = {insertMany : jest.fn()};
            const docs = [];

            const insert_many_mock = jest.spyOn(db, 'insert_many')

            await db.insert_many(model, docs);

            expect(insert_many_mock).toHaveBeenCalledWith(model, docs);
        })
    })

    describe('find_one', () => {
        test('should search for a single document based on the model `model`', async () => {
            const model = {findOne : jest.fn()};
            const query = {};
            const projection = '';

            const find_one_mock = jest.spyOn(db, 'find_one')

            await db.find_one(model, query, projection);

            expect(find_one_mock).toHaveBeenCalledWith(model, query, projection);
        })
    })

    describe('find_many', () => {
        test('should search for multiple documents based on the model `model`', async () => {
            const model = {find : jest.fn()};
            const query = {};
            const projection = '';

            const find_many_mock = jest.spyOn(db, 'find_many')

            await db.find_many(model, query, projection);

            expect(find_many_mock).toHaveBeenCalledWith(model, query, projection);
        })
    })

    describe('update_one', () => {
        test('should update the value defined in the object `update` on a single document based on the model `model` filtered by the object `filter`', async () => {
            const model = {updateOne: jest.fn()}
            const filter = {}
            const update = {}

            const update_one_mock = jest.spyOn(db, 'update_one')

            await db.update_one(model, filter, update);

            expect(update_one_mock).toHaveBeenCalledWith(model, filter, update);
        })
    })

    describe('update_many', () => {
        test('should update the value of many documents based on the model `model` filtered by the object `filter`', async () => {
            const model = {updateMany: jest.fn()}
            const filter = {}
            const update = {}

            const update_many_mock = jest.spyOn(db, 'update_many')

            await db.update_many(model, filter, update);

            expect(update_many_mock).toHaveBeenCalledWith(model, filter, update);
        })
    })

    describe('delete_one', () => {
        test('should delete a single document based on the model `model` filtered by the object `filter`', async () => {
            const model = {deleteOne: jest.fn()}
            const filter = {}

            const delete_one_mock = jest.spyOn(db, 'delete_one')

            await db.delete_one(model, filter);

            expect(delete_one_mock).toHaveBeenCalledWith(model, filter);
        })
    })

    describe('delete_many', () => {
        test('should delete many documents based on the model `model` filtered by the object `filter`', async () => {
            const model = {deleteMany: jest.fn()}
            const filter = {}

            const delete_many_mock = jest.spyOn(db, 'delete_many')

            await db.delete_many(model, filter);

            expect(delete_many_mock).toHaveBeenCalledWith(model, filter);
        })
    })
    
})