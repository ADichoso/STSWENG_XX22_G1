const to_laguna_campus = 
	//MANILA ENTRY
[
	"N/A",
	"DLSU Manila -> DLSU LC", 
	//LAGUNA ENTRY
	"Paseo -> DLSU LC", 
	"Carmona -> DLSU LC", 
	"Pavilion Mall -> DLSU LC", 
	"Walter Mart -> DLSU LC"
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
	["N/A",
	"DLSU LC -> DLSU Manila", 
	"DLSU LC -> Paseo", 
	"DLSU LC -> Carmona",
	"DLSU LC -> Pavilion Mall", 
	"DLSU LC -> Walter Mart"
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
    btn.style.left = '0';
    var user_location = document.getElementById('user_location');
    user_location.innerHTML = '';

    var option = document.createElement('option');
    option.value = '';
    option.setAttribute('selected', true);
    option.setAttribute('disabled', true);
    option.setAttribute('hidden', true);
    option.innerHTML = 'Select Location';

    var option_array = [option];
    var storage_entry = ["Paseo -> DLSU LC", "Carmona -> DLSU LC", "Pavilion Mall -> DLSU LC", "Walter Mart -> DLSU LC", "Yuchenco Bldg. -> DLSU LC", "N/A"];
    for (var i = 0; i < storage_entry.length; i++) {
      var entry_option = document.createElement('option');
      entry_option.value = i;
      entry_option.innerHTML = storage_entry[i];
      option_array.push(entry_option);
    }

    for (var i = 0; i < option_array.length; i++) {
      user_location.appendChild(option_array[i]);
    }

    user_location.style.width = '189px';
}

function right_click() {
	btn.style.left = '160px';
	var user_location = document.getElementById('user_location');
	user_location.innerHTML = '';

	var option = document.createElement('option');
	option.setAttribute('selected', true);
	option.setAttribute('disabled', true);
	option.setAttribute('hidden', true);
	option.innerHTML = 'Select Location';

	var option_array = [option];
	var storage_exit = ["DLSU LC -> Yuchenco Bldg.", "DLSU LC -> Paseo", "DLSU LC -> Carmona", "DLSU LC -> Pavilion Mall", "DLSU LC -> Walter Mart", "N/A"];
	for (var i = 0; i < storage_exit.length; i++) {
		var exit_option = document.createElement('option');
		exit_option.value = i;
		exit_option.innerHTML = storage_exit[i];
		option_array.push(exit_option);
	}

	for (var i = 0; i < option_array.length; i++) {
		user_location.appendChild(option_array[i]);
	}
}

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

function change_time_slots() {
	var user_location = document.getElementById('user_location').value;
	var button_clicked = document.getElementById('btn').style.left === '0px' ? 'entry' : 'exit';

	var container = document.getElementById('user_location');
	container.style.width = '188px';

	var timeSlots = document.getElementById('user_entryTime');
	timeSlots.innerHTML = '<option value="" disabled selected hidden s> Time Slot </option>';

	var selectedTimeSlots = button_clicked === 'entry' ? to_laguna_time_slots[user_location] : from_laguna_time_slots[user_location];

	for (var i = 0; i < selectedTimeSlots.length; i++) {
		var option = document.createElement('option');
		option.value = i;
		option.innerHTML = selectedTimeSlots[i];
		timeSlots.appendChild(option);
	}
}

function find_matching_seats(event) {
	event.preventDefault();

	var user_location = document.getElementById('user_location').value;
	var pickup_time = document.getElementById('user_entryTime').value;
	var dateTime = document.getElementById('user_date').value;

	var pickUpTimeObject = document.getElementById('user_entryTime');
	var user_locationObject = document.getElementById('user_location');

	if ( pickup_time == '' || user_location == ''  ) 
	{
		document.getElementById('user_date').value = "";
		$('#user_location').prop('selectedIndex', 0);
		$('#user_entryTime').prop('selectedIndex', 0);
		
		$('#error_box').css('display', 'block');
		$('#error_message').html('Please fill out all fields.');

		setTimeout(function() {
		$('#error_box').css('display', 'none');
		}, 3000);

	} 
	else if (  pickUpTimeObject.options[pickUpTimeObject.selectedIndex].text == 'N/A' || user_locationObject.options[user_locationObject.selectedIndex].text == 'N/A' )
	{

		document.getElementById('user_date').value = "";
		$('#user_location').prop('selectedIndex', 0);
		$('#user_entryTime').prop('selectedIndex', 0);
		
		$('#error_box').css('display', 'block');
		$('#error_message').html('N/A is not a valid option. Please select another option.');

		setTimeout(function() {
		$('#error_box').css('display', 'none');
		}, 3000);

	}
	else
	{

		var button_clicked = document.getElementById('btn').style.left === '0px' ? 'entry' : 'exit';

		if (button_clicked === 'entry') 
		{
			var location = to_laguna_time_slots[user_location];
			var number_of_seats_taken = 0;
			var actual_pick_up_time = location[pickup_time];

			document.getElementById("schedule_label").innerHTML = to_laguna_campus[user_location] + ' ' + actual_pick_up_time + ' ' + dateTime;

			fetch(`/Schedule/${dateTime}/${to_laguna_campus[user_location]}/${actual_pick_up_time}?button_clicked=${button_clicked}`)
			.then((response) => response.json())
			.then((data) => {
			
				number_of_seats_taken = data.length;
				generate_seats(number_of_seats_taken, data);

			})
			.catch((error) => {
				console.error('Error fetching data:', error);
				
			});
		}

		if (button_clicked=== 'exit') 
		{
			var location = from_laguna_time_slots[user_location];
			var number_of_seats_taken = 0;
			var actual_pick_up_time = location[pickup_time];

			document.getElementById("schedule_label").innerHTML = from_laguna_campus[user_location] + ' ' + actual_pick_up_time + ' ' + dateTime;

			fetch(`/Schedule/${dateTime}/${from_laguna_campus[user_location]}/${actual_pick_up_time}?button_clicked=${button_clicked}`)
			.then((response) => response.json())
			.then((data) => {
				
				number_of_seats_taken = data.length;
				generate_seats(number_of_seats_taken, data, from_laguna_campus[user_location]);

			})
			.catch((error) => {
				console.error('Error fetching data:', error);
				
			});
		}
	}
}

function generate_seats(number_of_seats_taken, data) {
	var schedule_container = document.getElementById('day_schedule');
	var departure_times_length = departure_times.length;
	console.log("YESH: " + departure_times_length);

	for (var i = 0; i < departure_times_length; i++) {
		var seatContainer = document.createElement('div');
		schedule_container.appendChild(seatContainer);
		seatContainer.setAttribute('id', 'seat_container');
		seatContainer.innerHTML = '';
		
		var maxCapacity = 13; 
		
		for (var i = 0; i < maxCapacity; i++) {
			var seatSquare = document.createElement('div');
			seatSquare.classList.add('seat');
			seatSquare.textContent = 'Seat ' + (i + 1);
			seatContainer.appendChild(seatSquare);
			
			if(i < number_of_seats_taken) {
				seatSquare.style.backgroundColor = "red";
			}
		}
	}
}