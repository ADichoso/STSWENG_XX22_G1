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
                { firstName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { lastName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: new RegExp('^' + payload + '.*', 'i') } } },
                { passengerType: { $regex: new RegExp('^' + payload + '.*', 'i') } },
                { id_number: parseInt(payload) || 0 },
                { profilePictre: { $regex: new RegExp('^' + payload + '.*', 'i') } }
              ]
            },
            'firstName lastName "$expr" passengerType id_number profilePicture'
          ).exec();

        search = search.slice(0, 10);
        res.send({payload: search});
    },

    get_search_profile : async function (req, res) {
      const query = {id_number: req.query.id_number};
      
        const projection = 'id_number firstName lastName designation passengerType profilePicture';
      
        const result = await db.find_one(User, query, projection);
      
        if (result != null) {
      
          const details = {
            id_number: result.id_number,
            firstName: result.firstName,
            lastName: result.lastName,
            designation: result.designation,
            passengerType: result.passengerType
          };

          if ( result.profilePicture == "public/images/profilepictures/Default.png" || result.profilePicture == null) {
            details.profilePicture = "images/profilepictures/Default.png"
          }
          else if ( result.profilePicture != "public/images/profilepictures/Default.png") {
            details.profilePicture = result.profilePicture;
          }
          else{
            details.profilePicture = "images/profilepictures/Default.png";
          }
      
          res.render('SearchProfile', details);
          
        } else {
          res.render('Error',res);
        }

    },

    get_search_reservation : async function (req, res) {

        var userID = req.query.id_number;

		    const result = await db.find_many(Reservation, {id_number: userID}, {_id:0, __v:0});

        res.render('SearchReservation', {result: result, id_number: userID});

    }

};

module.exports = searchController;