var function_called = 0; // 0 = left (Laguna), 1 = right (Manila)
var admin_function_call = 0; // 0 = registered user, 1 = admin
var edit_function_called = 0;
var count = null;

function left_click(){
    function_called = 0;
    btn.style.left = '0';
    location_change_form_helper(0, false);
}

function right_click(){
    function_called = 1;
    btn.style.left = '160px';
    location_change_form_helper(1, false);
}

function get_start_campus(){
	return function_called;
}

function e_left_click(){
    edit_function_called = 0;
    ebtn.style.left = '0';
    location_change_form_helper(0, true);
}

function e_right_click(){
    edit_function_called = 1;
    ebtn.style.left = '160px';
    location_change_form_helper(1, true);
}

function e_get_start_campus(){
	return edit_function_called;
}

function show_user_form(){
    admin_function_call = 0;
    show_schedule_form();
}

function show_admin_form(){
    admin_function_call = 1;
    show_schedule_form();
}

function ready_HTML(display_UI){
    
    if ( display_UI == 1 ){ //Admin 
        document.getElementById('reserveUser_schedule_btn').style.display = 'inline';
    }
    else{ //User
        document.getElementById('reserve_schedule_btn').style.left = '85%';
        document.getElementById('reserveUser_schedule_btn').style.display = 'none';
    }
    
}

function show_schedule_form() {
	var doc = document;
    var scheduleForm = null;
    var date_box = document.getElementById('user_date');
    var entry_box = doc.getElementById('user_entry');
    var entryTimeBox = doc.getElementById('user_entryTime');
    var exitBox = doc.getElementById('user_exit');
    var exitTimeBox = doc.getElementById('user_exitTime');
    var idBox = doc.getElementById('user_id_number');

    if ( admin_function_call == 0 ){
        idBox.style.display = 'none';
        idBox.type = 'hidden';
        scheduleForm = document.getElementsByClassName('form_box')[0];
        scheduleForm.querySelector('h2').innerHTML = 'Reserve Now';
        scheduleForm.querySelector('h4').innerHTML = 'Just one-click away';
        scheduleForm.style.height = '385px';
    }
    else{
        idBox.style.display = 'block';
        idBox.type = 'text';
        scheduleForm = document.getElementsByClassName('form_box')[0];
        scheduleForm.querySelector('h2').innerHTML = 'Admin Reserve';
        scheduleForm.querySelector('h4').innerHTML = 'Fillup to reserve for a user';
        scheduleForm.style.height = '450px';
    }
    
    if(idBox != null){
        idBox.value="";
    }
	
	date_box.value="";
	entry_box.value="";
	entryTimeBox.value="";
	exitBox.value="";
	exitTimeBox.value="";

	var newOption = doc.createElement('option');
	var optionText = doc.createTextNode('Time Slot');
	newOption.appendChild(optionText);
	newOption.setAttribute('value','');
	newOption.setAttribute('selected','');
	newOption.setAttribute('hidden','');
	
	entryTimeBox.appendChild(newOption);
	
	newOption = doc.createElement('option');
	optionText = doc.createTextNode('Time Slot');
	newOption.appendChild(optionText);
	newOption.setAttribute('value','');
	newOption.setAttribute('selected','');
	newOption.setAttribute('hidden','');
	
	exitTimeBox.appendChild(newOption);

	newOption = doc.createElement('option');
	optionText = doc.createTextNode('Entry Location');
	newOption.appendChild(optionText);
	newOption.setAttribute('value','');
	newOption.setAttribute('selected','');
	newOption.setAttribute('hidden','');
	
	entry_box.appendChild(newOption);
	
	newOption = doc.createElement('option');
	optionText = doc.createTextNode('Exit Location');
	newOption.appendChild(optionText);
	newOption.setAttribute('value','');
	newOption.setAttribute('selected','');
	newOption.setAttribute('hidden','');
	
	exitBox.appendChild(newOption);
	
    scheduleForm.style.display = 'block';
	
}

function fill_hidden_field(_box, _hiddenBox){
	var box = document.getElementById(_box);
	var hiddenBox = document.getElementById(_hiddenBox);
	hiddenBox.value = box.options[box.selectedIndex].text;
}
function populate_fields(){
	var startCampusBox = document.getElementById('hidden_start_campus');
	
	var idNumberBox = document.getElementById('user_id_number');
	var hidden_ID_numberBox = document.getElementById('hidden_ID_number');
	var adminIdBox = document.getElementById('adminId');
	
	adminIdBox.value = get_ID_number();
	
	var startVal;
	if(!get_start_campus())
		startVal = 'Laguna';
	else
		startVal = 'Manila';
	
	startCampusBox.value = startVal;
	
	if(idNumberBox.value != ""){
		hidden_ID_numberBox.value = idNumberBox.value;
	}
	else
		hidden_ID_numberBox.value = get_ID_number();
	
	fill_hidden_field('user_entry', 'hidden_entry_loc');
	fill_hidden_field('user_entryTime', 'hidden_entry_time');
	fill_hidden_field('user_exit', 'hidden_exit_loc');
	fill_hidden_field('user_exitTime', 'hidden_exit_time');
}

function get_ID_number(){
	return new URLSearchParams(window.location.search).get('id_number');
}
function hide_schedule_form(fromLoad = 0, resultArr = [], isSearch){

    var scheduleContainer = document.getElementsByClassName('schedule_container')[0];
    var scheduleForm = document.getElementsByClassName('form_box')[0];

    var div = document.createElement('div');
    div.className = 'reserved_schedule';
	if (count == null){
		count = scheduleContainer.childElementCount;
	}
	else{
		count = count + 1;
		
	} 
	div.setAttribute('id', count );
	if(resultArr.length != 0) var userID = resultArr[6];
	else var userID = get_ID_number();
	div.setAttribute('linkedidnumber', userID); 
	
    scheduleContainer.appendChild(div);
	
    var reserved_schedule_container = document.getElementsByClassName('reserved_schedule')[scheduleContainer.childElementCount - 1];
    var divBtn = document.createElement('div');
    divBtn.className = 'reserved_schedule_btn';
    
    reserved_schedule_container.appendChild(divBtn);
    
    if ( isSearch == false ){
        var edit_btn = document.createElement('button');
        edit_btn.className = 'edit_btn';
        edit_btn.setAttribute('type', 'button');
        edit_btn.setAttribute('id', 'e_btn' + count);
        edit_btn.setAttribute('onclick','show_edit_form(' + count + ')');
        edit_btn.innerHTML = 'EDIT';

        var delete_btn = document.createElement('button');
        delete_btn.className = 'delete_btn';
        delete_btn.setAttribute('type', 'button');
        delete_btn.setAttribute('id', 'd_btn' + count);
        delete_btn.setAttribute('onclick','show_delete_form(' + count + ')');
        delete_btn.innerHTML = 'DELETE';

        divBtn.appendChild(edit_btn);
        divBtn.appendChild(delete_btn);
    }
    
	if( fromLoad ){ //is being called to populate the list from after loading screen
		create_text_info(div, resultArr);
	}


}

function show_edit_form(i) {
	var doc = document;
    var editForm = document.getElementById('edit_box');
	var date_box = document.getElementById('user_date');
	var entry_box = doc.getElementById('editUser_entry');
	var entryTimeBox = doc.getElementById('editUser_entryTime');
	var exitBox = doc.getElementById('editUser_exit');
	var exitTimeBox = doc.getElementById('editUser_exitTime');

	date_box.value = "";
	entry_box.value = "";
	entryTimeBox.value = "";
	exitBox.value = "";
	exitTimeBox.value ="";
	
	var newOption = doc.createElement('option');
	var optionText = doc.createTextNode('Time Slot');
	newOption.appendChild(optionText);
	newOption.setAttribute('value','');
	newOption.setAttribute('selected','');
	newOption.setAttribute('hidden','');
	
	entryTimeBox.appendChild(newOption);
	
	newOption = doc.createElement('option');
	optionText = doc.createTextNode('Time Slot');
	newOption.appendChild(optionText);
	newOption.setAttribute('value','');
	newOption.setAttribute('selected','');
	newOption.setAttribute('hidden','');
	
	exitTimeBox.appendChild(newOption);
	
	var subBtn = document.getElementById('edit_btn');

    var idNumberBox = document.getElementById('e_hidden_id_number');
    idNumberBox.value = document.getElementById(i).getAttribute('linkedidnumber'); //Get the number linked to the reservation instead

    //^^^from edit form
	//vvv get current data
	var currCampus = document.getElementById('e_curr_start_campus');
	var currID = document.getElementById('e_curr_id_number');
	var currDate = document.getElementById('e_curr_date');
	var currEntryL = document.getElementById('e_curr_entry_loc');
	var currEntryT = document.getElementById('e_curr_entry_time');
	var currExitL = document.getElementById('e_curr_exit_loc');
	var currExitT = document.getElementById('e_curr_exit_time');
	
	var reserveText = document.getElementById(i).children[1];
	//alert(reserveText);
	currCampus.value = reserveText.children[0].innerHTML;
	currID.value = document.getElementById(i).getAttribute('linkedidnumber');
	currDate.value = reserveText.children[2].innerHTML;
	currEntryL.value = reserveText.children[4].textContent;
	currEntryT.value = reserveText.children[5].innerHTML;
	currExitL.value = reserveText.children[7].textContent;
	currExitT.value = reserveText.children[8].innerHTML;


	subBtn.setAttribute('onclick', 'hide_edit_form(' + i + ')');
	
    editForm.style.display = 'block';
	
}

function hide_edit_form(){
	var editForm = document.getElementById('edit_box');
	
	var startCampusBox = document.getElementById('e_hidden_start_campus');
	
	var startVal;
	if(!e_get_start_campus())
		startVal = 'Laguna';
	else
		startVal = 'Manila';
	
	startCampusBox.value = startVal;

	fill_hidden_field('editUser_entry', 'e_hidden_entry_loc');
	fill_hidden_field('editUser_entryTime', 'e_hidden_entry_time');
	fill_hidden_field('editUser_exit', 'e_hidden_exit_loc');
	fill_hidden_field('editUser_exitTime', 'e_hidden_exit_time');
		
	editForm.style.display="none";
}

function cancel_edit_form(){
    var editForm = document.getElementById('edit_box');
	
	editForm.style.display="none";
}

function show_delete_form(i) {
    var deleteForm = document.getElementById('delete_box');	
	var deleteButton = document.getElementById('delete_btn');
    		
	var currCampus = document.getElementById('d_curr_start_campus');
	var currID = document.getElementById('d_curr_id_number');
	var currDate = document.getElementById('d_curr_date');
	var currEntryL = document.getElementById('d_curr_entry_loc');
	var currEntryT = document.getElementById('d_curr_entry_time');
	var currExitL = document.getElementById('d_curr_exit_loc');
	var currExitT = document.getElementById('d_curr_exit_time');
	

	var reserveText = document.getElementById(i).children[1];
	currCampus.value = reserveText.children[0].innerHTML;
	currID.value = document.getElementById(i).getAttribute('linkedidnumber');
	currDate.value = reserveText.children[2].innerHTML;
	currEntryL.value = reserveText.children[4].textContent;
	currEntryT.value = reserveText.children[5].innerHTML;
	currExitL.value = reserveText.children[7].textContent;
	currExitT.value = reserveText.children[8].innerHTML;


    deleteForm.style.display = 'block';
    
	deleteButton.setAttribute('onclick', 'hide_delete_form()');
}

function hide_delete_form(){
	var deleteForm = document.getElementById('delete_box');
	
	deleteForm.style.display = "none";
}

function cancel_delete_form(){
    var deleteButton = document.getElementById('delete_btn');
	var deleteForm = document.getElementById('delete_box');
	
    var currCampus = document.getElementById('d_curr_start_campus');
	var currID = document.getElementById('d_curr_id_number');
	var currDate = document.getElementById('d_curr_date');
	var currEntryL = document.getElementById('d_curr_entry_loc');
	var currEntryT = document.getElementById('d_curr_entry_time');
	var currExitL = document.getElementById('d_curr_exit_loc');
	var currExitT = document.getElementById('d_curr_exit_time');
	

	currCampus.value = "";
	currID.value = "";
	currDate.value = "";
	currEntryL.value = "";
	currEntryT.value = "";
	currExitL.value = "";
	currExitT.value = "";

    deleteButton.setAttribute('onclick', '')
	deleteForm.style.display="none";
}

function create_text_info(main_div, resultArr = []){
    var hasResults = resultArr.length;
    var text_info = document.createElement('div');
    text_info.className = 'text_reserved_schedule';
    main_div.appendChild(text_info);

    var locationValue;
    if ( function_called == 0 ){
        locationValue = document.getElementById('laguna_btn');
    }
    else{
        locationValue = document.getElementById('manila_btn');
    }

    var dateValue = document.getElementById('user_date');
    var entryValue = document.getElementById('user_entry');
    var entryTimeValue = document.getElementById('user_entryTime');
    var exitValue = document.getElementById('user_exit');
    var exitTimeValue = document.getElementById('user_exitTime');

    var locationText = document.createElement('p');
	if(hasResults)
		locationText.innerHTML = resultArr[0];
	else
		locationText.innerHTML = locationValue.innerHTML.trim();

    var dateText = document.createElement('p');
    dateText.setAttribute('id', 'date_text');
	if(hasResults){
		dateText.innerHTML = resultArr[1];
	}
	else{
		if ( dateValue.value == '' ){
			dateText.innerHTML = 'N/A';
		}
		else{
			dateText.innerHTML = dateValue.value;
		}
	}

    var entryText = document.createElement('p');
	if(hasResults){
		entryText.innerHTML = resultArr[2];
	}
	else{
		if ( entryValue.options[entryValue.selectedIndex].text == 'N/A' || entryValue.options[entryValue.selectedIndex].text == "Entry Location"){
			entryText.innerHTML = 'N/A';
		}
		else{
			entryText.innerHTML = entryValue.options[entryValue.selectedIndex].text;
		}
	}

    var entryTimeText = document.createElement('p');
    if(hasResults) entryTimeText.innerHTML = resultArr[3];
	else{
		if ( entryTimeValue.options[entryTimeValue.selectedIndex].text == 'N/A' || entryTimeValue.options[entryTimeValue.selectedIndex].text == "Time Slot"){
			entryTimeText.innerHTML = 'N/A';
		}
		else{
			entryTimeText.innerHTML = entryTimeValue.options[entryTimeValue.selectedIndex].text;
		}
	}

    var exitText = document.createElement('p');
    if(hasResults) exitText.innerHTML = resultArr[4];
	else{
		if ( exitValue.options[exitValue.selectedIndex].text == 'N/A' || exitValue.options[exitValue.selectedIndex].text == "Exit Location"){
			exitText.innerHTML = 'N/A';
		}
		else{
			exitText.innerHTML = exitValue.options[exitValue.selectedIndex].text;
		}
	}

    var exitTimeText = document.createElement('p');
    if(hasResults) exitTimeText.innerHTML = resultArr[5];
	else{
		if ( exitTimeValue.options[exitTimeValue.selectedIndex].text == 'N/A' || exitTimeValue.options[exitTimeValue.selectedIndex].text == "Time Slot" ){
			exitTimeText.innerHTML = 'N/A';
		}
		else{
			exitTimeText.innerHTML = exitTimeValue.options[exitTimeValue.selectedIndex].text;
		}
	}


    var border = new Array();

    for ( var i = 0; i < 4; i++ ){
        border[i] = document.createElement('hr');
    }

    text_info.appendChild(locationText);
    text_info.appendChild(border[0]);
    text_info.appendChild(dateText);
    text_info.appendChild(border[1]);
    text_info.appendChild(entryText);
    text_info.appendChild(entryTimeText);
    text_info.appendChild(border[2]);
    text_info.appendChild(exitText);
    text_info.appendChild(exitTimeText);
    text_info.appendChild(border[3]);

}

function cancel_schedule_form(){
    var scheduleForm = document.getElementsByClassName('form_box')[0];
    scheduleForm.style.display = 'none';
}

function ready_change_time( location_id, time_id ){
    change_entry_time_slots(location_id, time_id);

}

function change_entry_time_slots(location_id, time_id){
    
    var timeSlots = document.getElementById(time_id);
    timeSlots.innerHTML = '';
    
    var selectedLocation = document.getElementById(location_id);
    var location = selectedLocation.options[selectedLocation.selectedIndex].value;

    if( function_called == 0 || edit_function_called == 0 ){ //From Laguna


        if ( location_id == 'user_entry' || location_id == 'editUser_entry'){ //Entry Point
            if ( location == 0 ){
                var storage_time = ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", 
                                    "08:30 AM", "09:00 AM", "09:30 AM", "10:30 AM", "11:30 AM", 
                                    "12:30 PM", "01:00 PM", "02:00 PM", "03:00 PM", "03:30 PM",
                                    "04:40 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 1 ){
                var storage_time = ["06:30 AM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 2 ){
                var storage_time = ["05:30 AM", "06:00 AM", "06:30 AM", "07:30 AM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 3 ){
                var storage_time = ["06:30 AM", "07:00 AM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else{
                var storage_time = ["N/A"];
                change_time_helper( time_id, storage_time );
            }
        }
    
        else if ( location_id = 'user_exit' || location_id == 'editUser_exit'){ //Exit Point 
            if ( location == 0 ){
                var storage_time = ["05:45 AM", "06:15 AM", "07:00 AM", "08:00 AM", "09:00 AM", 
                                    "11:00 AM", "01:00 PM", "02:30 PM", "03:30 PM", "05:10 PM", 
                                    "06:15 PM", "07:45 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 1 ){
                var storage_time = ["09:00 AM", "11:30 AM", "04:45 PM", "05:10 AM", "05:30 PM", 
                                    "06:00 PM", "06:30 PM", "07:00 PM", "07:45 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 2 ){
                var storage_time = ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
                                    "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 3 ){
                var storage_time = ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
                                    "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 4 ){
                var storage_time = ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
                                    "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else{
                var storage_time = ["N/A"];
                change_time_helper( time_id, storage_time );
            }
        }
    }
    else if (function_called == 1 || edit_function_called == 1)
    { //From Manila

        if ( location_id == 'user_entry' || location_id == 'editUser_entry'){ //Entry Point
            if ( location == 0 ){
                var storage_time = ["06:00 AM", "07:30 AM", "09:30 PM", "11:00 AM", "01:00 PM",
                                    "02:30 PM", "03:30 PM", "05:10 PM", "06:15 PM", "07:45 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 1 ){
                var storage_time = ["05:45 AM", "06:15 AM", "07:00 AM", "11:00 AM", "01:00 PM",
                                    "02:30 PM", "03:30 PM", "05:10 PM", "06:15 PM", "07:45 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
        }

        else if ( location_id = 'user_exit' || location_id == 'editUser_exit'){ //Exit Point
            if ( location == 0 ){
                var storage_time = ["05:45 AM", "06:15 AM", "07:00 AM", "08:00 AM", "09:00 AM", 
                                    "11:00 AM", "01:00 PM", "02:30 PM", "03:30 PM", "05:10 PM", 
                                    "06:15 PM", "07:45 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 1 ){
                var storage_time = ["09:00 AM", "11:30 AM", "04:45 PM", "05:10 AM", "05:30 PM", 
                                    "06:00 PM", "06:30 PM", "07:00 PM", "07:45 PM", "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 2 ){
                var storage_time = ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
                                    "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 3 ){
                var storage_time = ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
                                    "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else if ( location == 4 ){
                var storage_time = ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
                                    "N/A"];
                change_time_helper( time_id, storage_time );
            }
            else{
                var storage_time = ["N/A"];
                change_time_helper( time_id, storage_time );
            }
        }
        
    }
    

}

function change_time_helper( time_id, storage_time ){

    var timeSlots = document.getElementById(time_id);

    for ( var i = 0; i < storage_time.length; i++ ){
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = storage_time[i];
        timeSlots.appendChild(option);
    }
}

function location_change_form_helper(location, isEditButton){
    //Location 0 - Laguna || 1 - Manila

        
    if ( isEditButton == false )
    {
        var selectEntryContainer = document.getElementById('user_entry');
        selectEntryContainer.innerHTML = '';
    
        var selectExitContainer = document.getElementById('user_exit');
        selectExitContainer.innerHTML = '';

        if ( location == 0 ){  

            var storage_entry = ["Paseo -> DLSU LC", "Carmona -> DLSU LC", "Pavilion Mall -> DLSU LC", "Walter Mart -> DLSU LC", "N/A"];
            for ( var i = 0; i < storage_entry.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_entry[i];
                selectEntryContainer.appendChild(option);
            }

            var storage_exit = ["DLSU LC -> Yuchenco Bldg.", "DLSU LC -> Paseo", "DLSU LC -> Carmona", "DLSU LC -> Pavilion Mall", "DLSU LC -> Walter Mart", "N/A"];
            for ( var i = 0; i < storage_exit.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_exit[i];
                selectExitContainer.appendChild(option);
            }

        }
        else {

            selectEntryContainer.style.width = "191px";
            var storage_entry = ["Yuchenco Bldg. -> DLSU LC", "N/A"];
            for ( var i = 0; i < storage_entry.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_entry[i];
                selectEntryContainer.appendChild(option);
            }

            var storage_exit = ["DLSU LC -> Yuchenco Bldg.", "DLSU LC -> Paseo", "DLSU LC -> Carmona", "DLSU LC -> Pavilion Mall", "DLSU LC -> Walter Mart", "N/A"];
            for ( var i = 0; i < storage_exit.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_exit[i];
                selectExitContainer.appendChild(option);
            }

    
        }

        change_entry_time_slots('user_entry', 'user_entryTime')
        change_entry_time_slots('user_exit', 'user_exitTime')

    }
    else{

        var selectEntryContainer = document.getElementById('editUser_entry');
        selectEntryContainer.innerHTML = '';
        var selectExitContainer = document.getElementById('editUser_exit');
        selectExitContainer.innerHTML = '';

        if ( location == 0 ){  
            var storage_entry = ["Paseo -> DLSU LC", "Carmona -> DLSU LC", "Pavilion Mall -> DLSU LC", "Walter Mart -> DLSU LC", "N/A"];
            for ( var i = 0; i < storage_entry.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_entry[i];
                selectEntryContainer.appendChild(option);
            }

            var storage_exit = ["DLSU LC -> Yuchenco Bldg. ", "DLSU LC -> Paseo ", "DLSU LC -> Carmona  ", "DLSU LC -> Pavilion Mall ", "DLSU LC -> Walter Mart ", "N/A"];
            for ( var i = 0; i < storage_exit.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_exit[i];
                selectExitContainer.appendChild(option);
            }

        }
        else {
            selectEntryContainer.style.width = "185px";
            var storage_entry = ["Yuchenco Bldg. -> DLSU LC", "N/A"];
            for ( var i = 0; i < storage_entry.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_entry[i];
                selectEntryContainer.appendChild(option);
            }

            var storage_exit = ["DLSU LC -> Yuchenco Bldg. ", "DLSU LC -> Paseo ", "DLSU LC -> Carmona  ", "DLSU LC -> Pavilion Mall ", "DLSU LC -> Walter Mart ", "N/A"];
            for ( var i = 0; i < storage_exit.length; i++ ){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = storage_exit[i];
                selectExitContainer.appendChild(option);
            }
        }

        change_entry_time_slots('editUser_entry', 'editUser_entryTime')
        change_entry_time_slots('editUser_exit', 'editUser_exitTime')

    }
  
}
