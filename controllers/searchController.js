const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Reservation = require('../models/reservationdb.js');

const searchController = {

    get_search : function (req, res) {
        res.render('Search', res);
    },

    post_user_search : async function (req, res) {
        let payload = req.body.payload.trim();
        let search = await User.find(
            {
              $or: [
                { first_name: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { last_name: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { $expr: { $regexMatch: { input: { $concat: ['$first_name', ' ', '$last_name'] }, regex: new RegExp('^' + payload + '.*', 'i') } } },
                { passenger_type: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { id_number: parseInt(payload) || 0 },
                { profile_picture: { $regex: new RegExp('^' + payload + '.*', 'i') } }
              ]
            },
            'first_name last_name "$expr" passenger_type id_number profile_picture'
          ).exec();

        search = search.slice(0, 10);
        res.send({payload: search});
    },

    get_search_profile : async function (req, res) {
      const query = {id_number: req.query.id_number};
      
        const projection = 'id_number first_name last_name designation passenger_type profile_picture';
      
        const result = await db.find_one(User, query, projection);
      
        if (result != null) {
      
          const details = {
            id_number: result.id_number,
            first_name: result.first_name,
            last_name: result.last_name,
            designation: result.designation,
            passenger_type: result.passenger_type,
            profile_picture: result.profile_picture
          };
          
          console.log("Wow, heres the details")
          console.log(details)
          if (details.profile_picture == null)
            details.profile_picture = "images/profilepictures/Default.png";
      
          res.render('SearchProfile', details);
          
        } else {
          res.render('Error',res);
        }

    },

    get_search_reservation : async function (req, res) {

        var userID = req.query.id_number;

		    const result = await db.find_many(Reservation, {id_number: userID}, "-_id -__v");

        res.render('SearchReservation', {result: result, id_number: userID});

    }

};

module.exports = searchController;