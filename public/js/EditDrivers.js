function show_new_driver_form()
{
    console.log("Showing New Drivers!")
    document.getElementById('insert_box').style.display = 'block';
}

function hide_new_driver_form()
{
    console.log("Hiding New Drivers!")
    document.getElementById('insert_box').style.display = 'none';
}

function show_delete_driver_form(i)
{
    console.log("Showing Delete Drivers!")
    document.getElementById('delete_box').style.display = 'block';

    var d_curr_first_name = document.getElementById('d_curr_first_name');
	var d_curr_last_name = document.getElementById('d_curr_last_name');
	var d_curr_email = document.getElementById('d_curr_email');
	var d_curr_id_number = document.getElementById('d_curr_id_number');
	var d_delete_btn = document.getElementById('d_delete_btn');
	var d_cancel_btn = document.getElementById('d_cancel_btn');

	var reserveText = document.getElementById(i).children[1];
	d_curr_first_name.value = reserveText.children[0].innerHTML;
	d_curr_last_name.value =  reserveText.children[2].innerHTML;
	d_curr_email.value = reserveText.children[4].innerHTML;
	d_curr_id_number.value = reserveText.children[6].innerHTML;

    d_delete_btn.setAttribute('onclick', 'hide_delete_driver_form(' + i + ')');
    d_cancel_btn.setAttribute('onclick', 'cancel_delete_driver_form(' + i + ')');
}

function hide_delete_driver_form()
{
    console.log("Hiding Delete Drivers!")
    document.getElementById('delete_box').style.display = 'none';
}