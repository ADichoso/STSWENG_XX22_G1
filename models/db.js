
// import module `mongoose`
const mongoose = require('mongoose');

// ccapdev-mongoose is the name of the database
const url = 'mongodb+srv://prodUser:gVbdsrAF44jSEG0w@proddlsushuttledb.tcpcawr.mongodb.net/';


// additional connection options
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

// defines an object which contains necessary database functions
const database = {

    /*
        connects to database
    */
    connect: async function () {
        await mongoose.connect(url, options);
        console.log('Connected to: ' + url);
    },

    /*
        inserts a single `doc` to the database based on the model `model`
    */
    insert_one: async function(model, doc) {
        return await model.create(doc);
    },

    /*
        inserts multiple `docs` to the database based on the model `model`
    */
    insert_many: async function(model, docs) {
        return await model.insertMany(docs);
    },

    /*
        searches for a single document based on the model `model`
        filtered through the object `query`
        limits the fields returned based on the string `projection`
        callback function is called after the execution of findOne() function
    */
    find_one: async function(model, query, projection) {
        return model.findOne(query, projection);
    },

    /*
        searches for multiple documents based on the model `model`
        filtered through the object `query`
        limits the fields returned based on the string `projection`
        callback function is called after the execution of findMany() function
    */
    find_many: async function(model, query, projection) {
        return await model.find(query, projection);
    },

    /*
        updates the value defined in the object `update`
        on a single document based on the model `model`
        filtered by the object `filter`
    */
    update_one: async function(model, filter, update) {
        return await model.updateOne(filter, update);
    },

    /*
        updates the value defined in the object `update`
        on multiple documents based on the model `model`
        filtered using the object `filter`
    */
    update_many: async function(model, filter, update) {
        return await model.updateMany(filter, update);
    },

    /*
        deletes a single document based on the model `model`
        filtered using the object `conditions`
    */
    delete_one: async function(model, conditions) {
        return await model.deleteOne(conditions);
    },

    /*
        deletes multiple documents based on the model `model`
        filtered using the object `conditions`
    */
    delete_many: async function(model, conditions) {
        return await model.deleteMany(conditions);
    }

}

/*
    exports the object `database` (defined above)
    when another script exports from this file
*/
module.exports = database;