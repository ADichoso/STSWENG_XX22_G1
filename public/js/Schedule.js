
const trip_names = [
	"Line 1: DLSU Manila <—> DLSU-LAG",
	"Line 2: Paseo <—> DLSU-LAG",
	"Line 3: Carmona <—> DLSU-LAG",
	"Line 4: Pavilion Mall <—> DLSU-LAG",
	"Line 5: Walter Mart <—> DLSU-LAG"
];

const location_id_to_tags = {
	0: "MNL",
	1: "Paseo",
	2: "Carmona",
	3: "Pavilion",
	4: "Walter"
}

const to_laguna_campus = 
	//MANILA ENTRY
[
	"DLSU Manila -> DLSU LC", 
	//LAGUNA ENTRY
	"Paseo -> DLSU LC", 
	"Carmona -> DLSU LC", 
	"Pavilion Mall -> DLSU LC", 
	"Walter Mart -> DLSU LC",
	"N/A"
];

const to_laguna_campus_tags = {
		//MANILA ENTRY
	"MNL": "DLSU Manila -> DLSU LC",
	//LAGUNA ENTRY
	"Paseo": "Paseo -> DLSU LC",
	"Carmona": "Carmona -> DLSU LC",
	"Pavilion": "Pavilion Mall -> DLSU LC",
	"Walter": "Walter Mart -> DLSU LC",
};

const to_laguna_time_slots = {
	//MANILA ENTRY
	"NA": ["N/A"],
	"MNL": ["06:00 AM", "07:30 AM", "09:30 AM", "11:00 AM", "01:00 PM", 
	"02:30 PM", "03:30 PM", "05:10 PM", "06:15 PM", "07:45 PM", "Single Trip"],
	//LAGUNA ENTRY
	"Paseo": ["06:30 AM", "Single Trip"],
	"Carmona": ["05:30 AM", "06:00 AM", "06:30 AM", "07:30 AM", "Single Trip"],
	"Pavilion": ["06:30 AM", "07:00 AM", "Single Trip"],
	"Walter": ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", 
		"08:30 AM", "09:00 AM", "09:30 AM", "10:30 AM", "11:30 AM", 
		"12:30 PM", "01:00 PM", "02:00 PM", "03:00 PM", "03:30 PM",
		"04:40 PM", "Single Trip"],
};

const from_laguna_campus = 
	//LAGUNA AND MANILA EXIT
[	
	"DLSU LC -> DLSU Manila", 
	"DLSU LC -> Paseo", 
	"DLSU LC -> Carmona",
	"DLSU LC -> Pavilion Mall", 
	"DLSU LC -> Walter Mart",
	"N/A"
];

const from_laguna_campus_tags = {
		//MANILA ENTRY
	"MNL": "DLSU LC -> DLSU Manila",
	//LAGUNA ENTRY
	"Paseo": "DLSU LC -> Paseo",
	"Carmona": "DLSU LC -> Carmona",
	"Pavilion": "DLSU LC -> Pavilion Mall",
	"Walter": "DLSU LC -> Walter Mart",
};

const from_laguna_time_slots = {
	//LAGUNA AND MANILA EXIT
	"NA": ["N/A"],
	"MNL": ["05:45 AM", "06:15 AM", "07:00 AM", "08:00 AM", "09:00 AM", 
		"11:00 AM", "01:00 PM", "02:30 PM", "03:30 PM", "05:10 PM", 
		"06:15 PM", "07:45 PM", "Single Trip"],
	"Paseo": ["09:00 AM", "11:30 AM", "04:45 PM", "05:10 AM", "05:30 PM", 
		"06:00 PM", "06:30 PM", "07:00 PM", "07:45 PM", "Single Trip"],
	"Carmona": ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
		"Single Trip"],
	"Pavilion": ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
		"Single Trip"],
	"Walter": ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
		"Single Trip"],
};

function left_click() {
	var user_location = document.getElementById('user_location');
    user_location.innerHTML = '';

    var option = document.createElement('option');
    option.value = '';
    option.setAttribute('selected', true);
    option.setAttribute('disabled', true);
    option.setAttribute('hidden', true);
    option.innerHTML = 'Select Location';

    var option_array = [option];
    for (var i = 0; i < trip_names.length; i++) {
      var entry_option = document.createElement('option');
      entry_option.value = i;
      entry_option.innerHTML = trip_names[i];
      option_array.push(entry_option);
    }

    for (var i = 0; i < option_array.length; i++) {
      user_location.appendChild(option_array[i]);
    }
}

// function right_click() {
// 	var user_location = document.getElementById('user_location');
// 	user_location.innerHTML = '';

// 	var option = document.createElement('option');
// 	option.setAttribute('selected', true);
// 	option.setAttribute('disabled', true);
// 	option.setAttribute('hidden', true);
// 	option.innerHTML = 'Select Location';

// 	var option_array = [option];
// 	var storage_exit = ["DLSU LC -> Yuchenco Bldg.", "DLSU LC -> Paseo", "DLSU LC -> Carmona", "DLSU LC -> Pavilion Mall", "DLSU LC -> Walter Mart", "N/A"];
// 	for (var i = 0; i < trip_names.length; i++) {
// 		var exit_option = document.createElement('option');
// 		exit_option.value = i;
// 		exit_option.innerHTML = trip_names[i];
// 		option_array.push(exit_option);
// 	}

// 	for (var i = 0; i < option_array.length; i++) {
// 		user_location.appendChild(option_array[i]);
// 	}
// }

function show_schedule_form() {
	var scheduleForm = document.getElementsByClassName('form_box')[0];
	scheduleForm.style.display = 'block';
}

function hide_schedule_form() {
	var scheduleForm = document.querySelector('.form_box');
	scheduleForm.style.display = 'none';
}

function cancel_schedule_form() {
	var scheduleForm = document.getElementsByClassName('form_box')[0];
	scheduleForm.style.display = '';
}

// function change_time_slots() {
// 	// var user_location = document.getElementById('user_location').value;
// 	// var button_clicked = document.getElementById('btn').style.left === '0px' ? 'entry' : 'exit';

// 	// var container = document.getElementById('user_location');
// 	// container.style.width = '188px';

// 	// var timeSlots = document.getElementById('user_entryTime');
// 	// timeSlots.innerHTML = '<option value="" disabled selected hidden s> Time Slot </option>';

// 	// var selectedTimeSlots = button_clicked === 'entry' ? to_laguna_time_slots[user_location] : from_laguna_time_slots[user_location];

// 	// for (var i = 0; i < selectedTimeSlots.length; i++) {
// 	// 	var option = document.createElement('option');
// 	// 	option.value = i;
// 	// 	option.innerHTML = selectedTimeSlots[i];
// 	// 	timeSlots.appendChild(option);
// 	// }
// }

function find_matching_seats(event) {
	event.preventDefault();

	var user_location = document.getElementById('user_location').value;
	// var pickup_time = document.getElementById('user_entryTime').value;
	var dateTime = document.getElementById('user_date').value;

	// var pickUpTimeObject = document.getElementById('user_entryTime');
	// var user_locationObject = document.getElementById('user_location');
	// pickup_time == ''

	if ( user_location == ''  ) {
		document.getElementById('user_date').value = "";
		$('#user_location').prop('selectedIndex', 0);
		$('#user_entryTime').prop('selectedIndex', 0);
		
		$('#error_box').css('display', 'block');
		$('#error_message').html('Please fill out all fields.');

		setTimeout(function() {
		$('#error_box').css('display', 'none');
		}, 3000);

	} else {
		// var button_clicked = document.getElementById('btn').style.left === '0px' ? 'entry' : 'exit';
		fetch(`/Schedule/${dateTime}/${user_location}`)
		.then((response) => response.json())
		.then((data) => {
			generate_seats(data);
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
		//pickUpTimeObject.options[pickUpTimeObject.selectedIndex].text == 'N/A'
		// else if (  user_locationObject.options[user_locationObject.selectedIndex].text == 'N/A' )
		// {
	
		// 	document.getElementById('user_date').value = "";
		// 	$('#user_location').prop('selectedIndex', 0);
		// 	$('#user_entryTime').prop('selectedIndex', 0);
			
		// 	$('#error_box').css('display', 'block');
		// 	$('#error_message').html('N/A is not a valid option. Please select another option.');
	
		// 	setTimeout(function() {
		// 	$('#error_box').css('display', 'none');
		// 	}, 3000);
	
		// }
		
		// if (false) 
		// {
		// 	var location = to_laguna_time_slots[user_location];
		// 	var number_of_seats_taken = 0;
		// 	var actual_pick_up_time = location[pickup_time];

		// 	document.getElementById("schedule_label").innerHTML = to_laguna_campus[user_location] + ' ' + actual_pick_up_time + ' ' + dateTime;

		// 	fetch(`/Schedule/${dateTime}/${to_laguna_campus[user_location]}/${actual_pick_up_time}?button_clicked=${button_clicked}`)
		// 	.then((response) => response.json())
		// 	.then((data) => {
			
		// 		number_of_seats_taken = data.length;
		// 		generate_seats(number_of_seats_taken, data);

		// 	})
		// 	.catch((error) => {
		// 		console.error('Error fetching data:', error);
		// 	});
		// }

		// if (false) 
		// {
		// 	var location = from_laguna_time_slots[user_location];
		// 	var number_of_seats_taken = 0;
		// 	var actual_pick_up_time = location[pickup_time];

		// 	document.getElementById("schedule_label").innerHTML = from_laguna_campus[user_location] + ' ' + actual_pick_up_time + ' ' + dateTime;

		// 	fetch(`/Schedule/${dateTime}/${from_laguna_campus[user_location]}/${actual_pick_up_time}?button_clicked=${button_clicked}`)
		// 	.then((response) => response.json())
		// 	.then((data) => {
				
		// 		number_of_seats_taken = data.length;
		// 		generate_seats(number_of_seats_taken, data, from_laguna_campus[user_location]);

		// 	})
		// 	.catch((error) => {
		// 		console.error('Error fetching data:', error);
				
		// 	});
		// }
	}
}

function generate_seats(data) {
	var schedule_container = $('#day_schedule');
	var to_container = $('#to_schedule');
	var from_container = $('#from_schedule');
	
	var location_id = data.location;
	var to_laguna_length = data.to_laguna.length;
	var from_laguna_length = data.from_laguna.length;
	var is_admin = data.is_admin;

	var maxCapacity = 13;

	var to_time = to_laguna_time_slots[location_id_to_tags[location_id]];
	var from_time = from_laguna_time_slots[location_id_to_tags[location_id]]

	to_container.empty();
	from_container.empty();
	to_container.append(`<div><h2>` + to_laguna_campus[location_id] + `</h2></div><br>`);
	from_container.append(`<div><h2>` + from_laguna_campus[location_id] + `</h2></div><br>`);

	console.log(data);
	console.log(location_id);
	console.log(location_id_to_tags[location_id]);
	console.log(to_time);

	var to_counter = {};
	var from_counter = {};

	data.to_laguna.forEach(element => {
		if (!to_counter[element.entry_time]) {
			to_counter[element.entry_time] = 1;
		} else {
			to_counter[element.entry_time] += 1;
		}
	});

	data.from_laguna.forEach(element => {
		if (!from_counter[element.exit_time]) {
			from_counter[element.exit_time] = 1;
		} else {
			from_counter[element.exit_time] += 1;
		}
	});

	var to_list = {};
	var from_list = {};

	if (is_admin) {
		data.to_laguna.forEach(element => {
			var name_data = data.to_names[element.id_number];
			var user_data = {first_name: name_data.first_name, last_name: name_data.last_name, id_number: element.id_number}
			if (!to_list[element.entry_time]) {
				to_list[element.entry_time] = [user_data];
			} else {
				to_list[element.entry_time].push(user_data);
			}
		});
	
		data.from_laguna.forEach(element => {
			var name_data = data.to_names[element.id_number];
			var user_data = {first_name: name_data.first_name, last_name: name_data.last_name, id_number: element.id_number}
			if (!from_list[element.exit_time]) {
				from_list[element.exit_time] = [user_data];
			} else {
				from_list[element.exit_time].push(user_data);
			}
		});
		$(`#print_schedule`).removeClass('hide');
	}

	console.log(to_counter);

	to_time.forEach(element => {
		if (element != "Single Trip") {
			checker = `#TO\\ ` + element.substring(0, 2) + `\\` + element.substring(2, 5) + `\\ ` + element.substring(6, 8);
			if (is_admin == false) {
				to_container.append(`<div id="TO ` + element + `" class="seat_container"><h2>` + element + `</h2></div><br>`);
				for (var i = 0; i < 13; i++) {
					if (i < to_counter[element]){
						$(checker).append(`<div class="seat" style="background-color: red;">`+ (i + 1) +`</div>`)
					} else {
						$(checker).append(`<div class="seat">`+ (i + 1) +`</div>`)
					}
				}
			} else {
				if (to_list[element]) {
					to_container.append(`<h2>` + element + `</h2><br><table id="TO ` + element + `" class="name_container"></table>`);
					to_list[element].forEach(passenger =>{
						$(checker).append(`<tr><td>`+ passenger.last_name + " </td><td> " + passenger.first_name + " </td><td> " + passenger.id_number +`</td></tr>`);
					});
				} else {
					to_container.append(`<h2>` + element + `</h2><h4>No Reservations</h4>`);
				}
			}
		}
	})

	from_time.forEach(element => {
		if (element != "Single Trip") {
			checker = `#FROM\\ ` + element.substring(0, 2) + `\\` + element.substring(2, 5) + `\\ ` + element.substring(6, 8);
			if (is_admin == false) {
				from_container.append(`<div id="FROM ` + element + `" class="seat_container"><h2>` + element + `</h2></div><br>`);
				for (var i = 0; i < 13; i++) {
					if (i < from_counter[element]){
						$(checker).append(`<div class="seat" style="background-color: red;">`+ (i + 1) +`</div>`)
					} else {
						$(checker).append(`<div class="seat">`+ (i + 1) +`</div>`)
					}
				}
			} else {
				if (from_list[element]) {
					from_container.append(`<h2>` + element + `</h2><br><table id="FROM ` + element + `" class="name_container"></table>`);
					from_list[element].forEach(passenger =>{
						$(checker).append(`<tr><td>`+ passenger.last_name + " </td><td> " + passenger.first_name + " </td><td> " + passenger.id_number +`</td></tr>`);
					});
				} else {
					from_container.append(`<h2>` + element + `</h2><h4>No Reservations</h4>`);
				}
			}
		}
	})

	// data.to_laguna.forEach(element => {
		
	// });


	// for (var i = 0; i < departure_times_length; i++) {
	// 	var seatContainer = document.createElement('div');
	// 	schedule_container.appendChild(seatContainer);
	// 	seatContainer.setAttribute('id', 'seat_container');
	// 	seatContainer.innerHTML = '';
		
	// 	var maxCapacity = 13; 
		
	// 	for (var i = 0; i < maxCapacity; i++) {
	// 		var seatSquare = document.createElement('div');
	// 		seatSquare.classList.add('seat');
	// 		seatSquare.textContent = 'Seat ' + (i + 1);
	// 		seatContainer.appendChild(seatSquare);
			
	// 		if(i < 1) {
	// 			seatSquare.style.backgroundColor = "red";
	// 		}
	// 	}
	// }
}

function print_schedule() {
	console.log("PRINTING!!!");
	$("#view_schedule_btn").hide();
	$("#print_schedule").hide();
	$("#back_img").hide();
	$("#Header-1").hide();
	$("#P-1").hide();
	$(".content").attr('style', 'height: fit-content;');
	print();
	$("#view_schedule_btn").show();
	$("#print_schedule").show();
	$("#back_img").show();
	$("#Header-1").show();
	$("#P-1").show();
	$(".content").removeAttr('style');
}