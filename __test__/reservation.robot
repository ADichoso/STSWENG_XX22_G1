*** Settings ***
Name              Reservation Test Suite
Documentation     A test suite for validation of Reservation features.
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary
Library    XML

*** Variables ***
${BROWSER}    headlesschrome
${URL}    https://sweng-testing-ci.onrender.com/

#user role account
${account_id}    34433443
${account_pass}    3443
${account_security_check}   3443
${date}    04022025

${admin_id}    89898989
${admin_pass}    8989
${admin_security_check}    8989

${driver_id}    45544554
${driver_pass}    4554
${driver_security_check}    4554


*** Keywords ***
Login to Profile
    [Arguments]    ${id}    ${pass}    ${security_check}
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Login to User Profile
    Input Text    id=id_number    ${id}
    Input Text    id=user_password    ${pass}
    Click Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${security_check}
    Click Button    xpath=//button[@type='submit']

Open Reservations
    [Arguments]    ${account_id}
    Click Link    /Reservation?id_number=${account_id}
    
    ${cur_url}=    Get Location
    Should Be Equal    ${cur_url}    ${URL}Reservation?id_number=${account_id}


*** Test Cases ***
6-1 Creating a Valid Reservation to Laguna Campus
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}

    Click Button    id=reserve_schedule_btn

    ${reservations}=    Get Element Count    class=text_reserved_schedule

    ${user_entry}=    Evaluate    str(random.randint(0, 3))

    ${locations}=    Create List    Paseo    Carmona    Pavilion    Walter
    Select From List By Value    id=user_entry    ${locations[${user_entry}]}

    Click Element    id=user_date
    Press Key    id=user_date    key=SHIFT+TAB
    Press Key    id=user_date    key=SHIFT+TAB
    Input Text    id=user_date    ${date}

    Click Button    id=reserve_btn

    
    #checks if reservations is now +1
    ${new_reservations}=    Get Element Count    class=text_reserved_schedule
    Should Be True    ${new_reservations} > ${reservations}
    
    ${new_reservation}=    Get Text    xpath=/html/body/div[1]/div[2]/div[1]/div[last()]

    Should Contain    ${new_reservation}    Laguna

    Close All Browsers

6-2 Creating a Reservation to Manila Campus
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}

    Click Button    id=reserve_schedule_btn

    ${reservations}=    Get Element Count    class=text_reserved_schedule

    ${locations}=    Set Variable    MNL
    Select From List By Value    id=user_entry    ${locations}

    Click Element    id=user_date
    Press Key    id=user_date    key=SHIFT+TAB
    Press Key    id=user_date    key=SHIFT+TAB
    Input Text    id=user_date    ${date}

    Click Button    id=reserve_btn

    
    #checks if reservations is now +1
    ${new_reservations}=    Get Element Count    class=text_reserved_schedule
    Should Be True    ${new_reservations} > ${reservations}
    
    ${new_reservation}=    Get Text    xpath=/html/body/div[1]/div[2]/div[1]/div[last()]

    Should Contain    ${new_reservation}    Laguna

    Close All Browsers

6-4 Editing Reservation
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}
    ${locations}=    Create List    Paseo    Carmona    Pavilion    Walter
    ${random_location}=    Evaluate    str(random.randint(0, 3))

    #Get the ID of the last element in xpath=/html/body/div[1]/div[2]/div[1]/div[last()]
    ${last_reservation_id}=    Get Element Attribute    xpath=/html/body/div[1]/div[2]/div[1]/div[last()]    id

    Click Button    id=e_btn${last_reservation_id}

    Select From List By Value    id=editUser_entry    ${locations[${random_location}]}


    Click Element    xpath=/html/body/div[1]/div[2]/div[3]/div[2]/form/input[14]
    Press Key    xpath=/html/body/div[1]/div[2]/div[3]/div[2]/form/input[14]    key=SHIFT+TAB
    Press Key    xpath=/html/body/div[1]/div[2]/div[3]/div[2]/form/input[14]    key=SHIFT+TAB
    Input Text    xpath=/html/body/div[1]/div[2]/div[3]/div[2]/form/input[14]    04022022
    
    Click Button    id=edit_btn
    
    Wait Until Element Is Visible    id=success_box
    ${success_message}=    Get Text    id=success_message
    Should Contain    ${success_message}    Reservation successfully updated!

    Close All Browsers

6-5 Editing With Invalid Details
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}

    ${new_url}=    Get Location

    #Get the ID of the last element in xpath=/html/body/div[1]/div[2]/div[1]/div[last()]
    ${last_reservation_id}=    Get Element Attribute    xpath=/html/body/div[1]/div[2]/div[1]/div[last()]    id

    Click Button    id=e_btn${last_reservation_id}

    Click Button    xpath=/html/body/div/div[2]/div[3]/div[2]/form/button
    #nothing should happen

    ${cur_url}=    Get Location
    Should Be Equal    ${cur_url}    ${new_url}

6-6 Deleting/Cancelling Reservation
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}
    
    ${reservations}=    Get Element Count    class=text_reserved_schedule
    #Deleting Reservation

    #Get the ID of the last element in xpath=/html/body/div[1]/div[2]/div[1]/div[last()]
    ${last_reservation_id}=    Get Element Attribute    xpath=/html/body/div[1]/div[2]/div[1]/div[last()]    id

    Click Button    id=d_btn${last_reservation_id}
    Click Button    id=delete_btn

    Wait Until Element Is Visible    id=success_box
    ${success_message}=    Get Text    id=success_message
    Should Contain    ${success_message}    Reservation successfully deleted!

    #Get new reservations count
    ${new_reservations}=    Get Element Count    class=text_reserved_schedule
    Should Be True    ${new_reservations} < ${reservations}

    Close All Browsers


6-7 Admin Reserves for a User
    #initial count of reservations by logging in to user first
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}
    ${reservations}=    Get Element Count    class=text_reserved_schedule
    Go To    ${URL}logout
    Close Browser

    
    Login to Profile    ${admin_id}    ${admin_pass}    ${admin_security_check}
    Open Reservations    ${admin_id}

    Click Button    id=reserveUser_schedule_btn

    Select From List By Value    id=user_entry    MNL

    #date
    Click Element    id=user_date
    Press Key    id=user_date    key=SHIFT+TAB
    Press Key    id=user_date    key=SHIFT+TAB
    Input Text    id=user_date    ${date}

    Input Text    id=id_number    ${account_id}

    Click Button    id=reserve_btn

    Go To    ${URL}logout

    Close Browser

    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}

    #checks if reservations is now +1
    ${new_reservations}=    Get Element Count    class=text_reserved_schedule
    Should Be True    ${new_reservations} > ${reservations}

    Close All Browsers

6-8 Driver Reserves for a User
    #initial count of reservations by logging in to user first
    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}
    ${reservations}=    Get Element Count    class=text_reserved_schedule
    Go To    ${URL}logout
    Close Browser

    
    Login to Profile    ${driver_id}    ${driver_pass}    ${driver_security_check}
    Open Reservations    ${driver_id}

    Click Button    id=reserveUser_schedule_btn

    Select From List By Value    id=user_entry    MNL

    #date
    Click Element    id=user_date
    Press Key    id=user_date    key=SHIFT+TAB
    Press Key    id=user_date    key=SHIFT+TAB
    Input Text    id=user_date    ${date}

    Input Text    id=id_number    ${account_id}

    Click Button    id=reserve_btn

    Go To    ${URL}logout

    Close Browser

    Login to Profile    ${account_id}    ${account_pass}    ${account_security_check}
    Open Reservations    ${account_id}

    #checks if reservations is now +1
    ${new_reservations}=    Get Element Count    class=text_reserved_schedule
    Should Be True    ${new_reservations} > ${reservations}

    Close All Browsers