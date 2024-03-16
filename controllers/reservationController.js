const db = require('../models/db.js');

const User = require('../models/userdb.js');

const Admin = require('../models/admindb.js');

const Reservation = require('../models/reservationdb.js');

const reservationController = {

    get_reservations: async function (req, res) {
		
		if ( req.session.id_number != req.query.id_number ) {
			res.redirect('/Reservation?id_number=' + req.session.id_number );
		}else{
			const query = { id_number: req.query.id_number };
			const projection = "id_number";
			
			const is_admin = await db.find_one(Admin, query, projection);
	
			const result = await db.find_many(Reservation, query);
            
            console.log(query)
            console.log(result)
			if ( is_admin != null ) {
				res.render('Reservation', {display_UI: 1, result: result, id_number: req.query.id_number, is_admin: true});
			} else {
				res.render('Reservation', {display_UI: 0, result: result, id_number: req.query.id_number, is_admin: false});
			}
		}

		
    },

    get_reservation_admin: async function (req, res) {

		if ( req.session.id_number != req.query.id_number ){

			var userID = req.session.id_number;
			const query = { id_number: userID };
			const projection = "id_number";

			const isAdmin = await db.find_one(Admin, query, projection);

			if ( isAdmin != null ){
				res.redirect('/ReservationAdmin?id_number=' + req.session.id_number );
			}else{
				res.render('Error');
			}
			
		}else{
			var userID = req.query.id_number;

			const details = {
				id_number: userID,
			}
	
			res.render('ReservationAdmin', details);
		}

    },

	//Add reservation
	post_reservations: async function (req, res) {
        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="fName">
            can be retrieved using `req.body.fName`
        */		
		if (req.body.user_id_number != ""){

			const id_number = req.body.user_id_number;

			const query = { id_number: id_number};
			const projection = "id_number";
			const result = await db.find_one(User, query, projection);
			const result2 = await db.find_one(Admin, query, projection);
			
			if (result) {
				var idNum = req.body.user_id_number;
			} else if (result2) {
				var idNum = req.body.user_id_number;
			} else {
				var idNum = 0;
				console.log('User does not exist');
			}

		}
		else{
			var idNum = req.body.hiddenIdNumber;
		}
			
        var rsv = {
			startCampus: req.body.hiddenStartCampus,
			date: req.body.user_date,
			entryLoc: req.body.hiddenEntryLoc,
			entryTime: req.body.hiddenEntryTime,
			exitLoc: req.body.hiddenExitLoc,
			exitTime: req.body.hiddenExitTime,
		  };

		if ( rsv.entryLoc == "Entry Location" || rsv.entryTime == "Entry Time" || rsv.exitLoc == "Exit Location" || rsv.exitTime == "Exit Time" ){
			res.redirect('/Reservation?id_number=' + req.body.adminId + '&reserveUserSuccess=false');
			console.log('Reservation failed to add');
		}
		else{

			var result;
			if (idNum !== 0) {
				rsv.id_number = idNum;
				result = await db.insert_one(Reservation, rsv);
			}
			/*
				calls the function insert_one()
				defined in the `database` object in `../models/db.js`
				this function adds a document to collection `reservations`
			*/
			
			if ( result ){
				console.log('Reservation successfully added');
				res.redirect('/Reservation?id_number=' + req.body.adminId + '&reserveUserSuccess=true');
			}
			else{
				res.redirect('/Reservation?id_number=' + req.body.adminId + '&reserveUserSuccess=false');
				console.log('Reservation failed to add');
			}
		}

    },

	post_update_reservations: async function (req, res){
		var curr ={
			startCampus: req.body.eCurrStartCampus,
			date: req.body.eCurrDate,
			entryLoc: req.body.eCurrEntryLoc,
			entryTime: req.body.eCurrEntryTime,
			exitLoc: req.body.eCurrExitLoc,
			exitTime: req.body.eCurrExitTime,
			id_number: req.body.eCurrIdNumber
		}

		var upd = {
			startCampus: req.body.ehiddenStartCampus,
			date: req.body.user_date,
			entryLoc: req.body.ehiddenEntryLoc,
			entryTime: req.body.ehiddenEntryTime,
			exitLoc: req.body.ehiddenExitLoc,
			exitTime: req.body.ehiddenExitTime,
			id_number: req.body.ehiddenIdNumber
		}
		
		if ( upd.entryLoc == "Entry Location" || upd.entryTime == "Entry Time" || upd.exitLoc == "Exit Location" || upd.exitTime == "Exit Time" ){
			res.redirect('/Reservation?id_number=' + req.body.ehiddenIdNumber + '&isUpdateSuccess=false');
			console.log('Reservation failed to add');
		}
		else{
			
			console.log(upd.entryLoc);
			console.log(upd.entryTime);
			console.log(upd.exitLoc);
			console.log(upd.exitTime);

			var found = await db.find_one(Reservation, curr);
			if(found){
				await Reservation.updateOne(curr, upd);
				console.log('succesfully updated');
				res.redirect('/Reservation?id_number=' + req.body.ehiddenIdNumber + '&isUpdateSuccess=true');
			}
			else{
				console.log("Code monkeys did an oopsie daisy");
				console.log('error somewhere');
			}
		}

		
	},

	post_delete: async function (req, res){
		var rsv = {
			startCampus: req.body.dCurrStartCampus,
			date: req.body.dCurrDate,
			entryLoc: req.body.dCurrEntryLoc,
			entryTime: req.body.dCurrEntryTime,
			exitLoc: req.body.dCurrExitLoc,
			exitTime: req.body.dCurrExitTime,
			id_number: req.body.dCurrIdNumber
		};

		console.log('to delete');
		console.log(rsv);
		var deleted = await Reservation.deleteOne(rsv);
		if(deleted){
			console.log('succesfully deleted');
			res.redirect('/Reservation?id_number=' + req.body.dCurrIdNumber + '&isDeleteSuccess=true');
		}
		else{
			console.log("Code monkeys did an oopsie daisy");
			console.log('error somewhere');
		}

	},

	get_search_user: async function (req, res){

		res.redirect('/ReservationAdmin?id_number=' + req.query.id_number);

	},

	post_search_user: async function (req, res){

		var id_number = req.body.user_id_number;
		var adminId = req.body.adminId;

		const isFoundUser = await db.find_one(User, {id_number: id_number}, {id_number: 1});
		const isFoundAdmin = await db.find_one(Admin, {id_number: id_number}, {id_number: 1});

		if ( isFoundUser == null && isFoundAdmin == null ){
			res.redirect('/ReservationAdmin?id_number=' + adminId + '&isSearchUserValid=false');
		}
		else{

			console.log('test');

			const result = await db.find_many(Reservation, {id_number: id_number}, "");

			if ( result.length !== 0 ){
				res.render('ReservationAdmin', {result: result, adminId: adminId});
			} 
			else {
				res.redirect('/ReservationAdmin?id_number=' + adminId + '&reservationList=false');
			}

		}
		
		

	},

	post_search_user_update: async function (req, res){
		var curr ={
			startCampus: req.body.eCurrStartCampus,
			date: req.body.eCurrDate,
			entryLoc: req.body.eCurrEntryLoc,
			entryTime: req.body.eCurrEntryTime,
			exitLoc: req.body.eCurrExitLoc,
			exitTime: req.body.eCurrExitTime,
			id_number: req.body.eCurrIdNumber
		}

		var upd = {
			startCampus: req.body.ehiddenStartCampus,
			date: req.body.user_date,
			entryLoc: req.body.ehiddenEntryLoc,
			entryTime: req.body.ehiddenEntryTime,
			exitLoc: req.body.ehiddenExitLoc,
			exitTime: req.body.ehiddenExitTime,
			id_number: req.body.ehiddenIdNumber
		}

		console.log("current reservation:");
		console.log(curr);
		console.log("To be updated with: ");
		console.log(upd);

		if ( upd.entryLoc == "Entry Location" || upd.entryTime == "Entry Time" || upd.exitLoc == "Exit Location" || upd.exitTime == "Exit Time" ){

			var adminId = req.body.eAdminId;
			if (adminId == null){
				console.log("OH NO THE CODE MONKEYS DID AN OOPSIE WOOPSIE");
				adminId = 1111111;
			}
			const result = await db.find_many(Reservation, {id_number: upd.id_number}, {_id:0, __v:0});

			res.render('ReservationAdmin', {result, result, adminId: adminId, isUpdateSuccess: false});
			console.log('Reservation failed to add');

		}
		else{
			
			var found = await db.find_one(Reservation, curr);
			if(found){
				await Reservation.updateOne(curr, upd);
				console.log('Succesfully updated');
				
				var adminId = req.body.eAdminId;
				if (adminId == null){
					console.log("OH NO THE CODE MONKEYS DID AN OOPSIE WOOPSIE");
					adminId = 1111111;
				}
				const result = await db.find_many(Reservation, {id_number: upd.id_number}, {_id:0, __v:0});
				res.render('ReservationAdmin', {result: result, adminId: adminId, isUpdateSuccess: true});
			}
			else{
				console.log("Code monkeys did an oopsie daisy");
				console.log('error somewhere');
			}
		}
		

	},

	post_search_user_delete: async function (req, res){
		var rsv = {
			startCampus: req.body.dCurrStartCampus,
			date: req.body.dCurrDate,
			entryLoc: req.body.dCurrEntryLoc,
			entryTime: req.body.dCurrEntryTime,
			exitLoc: req.body.dCurrExitLoc,
			exitTime: req.body.dCurrExitTime,
			id_number: req.body.dCurrIdNumber
		};

		console.log('to delete');
		console.log(rsv);
		var deleted = await Reservation.deleteOne(rsv);
		if(deleted){
			console.log('succesfully deleted');
			
			var adminId = req.body.dAdminId;
			if (adminId == null){
				console.log("OH NO THE CODE MONKEYS DID AN OOPSIE WOOPSIE");
				adminId = 1111111;
			}
			const result = await db.find_many(Reservation, {id_number: rsv.id_number}, {_id:0, __v:0});
			res.render('ReservationAdmin', {result: result, adminId: adminId, isDeleteSuccess: true});
		}
		else{
			console.log("Code monkeys did an oopsie daisy");
			console.log('error somewhere');
		}

	}
    
}

module.exports = reservationController;
