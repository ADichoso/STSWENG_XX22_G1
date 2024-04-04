*** Settings ***
Name              Schedule Reservation Test Suite
Documentation     A test suite for scheduling reservations
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary
Library    XML
Library    DateTime

*** Variables ***
${BROWSER}    headlesschrome
${URL}    https://sweng-testing-ci.onrender.com/
${account_id}    34433443
${account_pass}    3443
${account_security_check}   3443
${date}    03312024

*** Keywords ***
Login to Profile
    Input Text    id=id_number    ${account_id}
    Input Text    id=user_password    ${account_pass}
    Click Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${account_security_check}
    Click Button    xpath=//button[@type='submit']

Login to Driver Profile
    Input Text    id=id_number    45544554
    Input Text    id=user_password    4554
    Click Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    4554
    Click Button    xpath=//button[@type='submit']

Open a Schedule

    Click Link    locator=/Schedule
    Click Button    id=view_schedule_btn
    
    Click Element    id=user_date
    Press Key    id=user_date    key=SHIFT+TAB
    Press Key    id=user_date    key=SHIFT+TAB
    Input Text    id=user_date    ${date}
    Select From List By Value    id=user_location    1
    
    Click Element    id=user_date
    Press Key    id=user_date    key=SHIFT+TAB
    Press Key    id=user_date    key=SHIFT+TAB
    Input Text    id=user_date    ${date}

    Click Button    id=reserve_btn

*** Test Cases ***
4-1 Checking the Schedule of a given date
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0
    
    Login to Profile
    Open a Schedule
        
    Close All Browsers

4-2 Cancelling the Schedule Input
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0
    
    Login to Profile
    Open a Schedule
    
    Click Button    id=view_schedule_btn
    ${date_value}=    Get Value    id=user_date
    Click Link    xpath=/html/body/div[1]/div[2]/div[2]/div[3]/a
    Sleep    1s
    Click Button    id=view_schedule_btn

    #Check the values inside the form, if they are retained
    
    ${retained_date_value}=    Get Value    id=user_date
    Should Be Equal    ${retained_date_value}    ${date_value}

    ${location_value}=    Get Selected List Label    id=user_location
    Should Be Equal    ${location_value}    Line 2: Paseo <—> DLSU-LAG

    Close All Browsers

4-3 Missing Date
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0
    
    Login to Profile
    Click Link    locator=/Schedule
    Click Button    id=view_schedule_btn
    
    Select From List By Value    id=user_location    0

    Click Button    id=reserve_btn

    Sleep    2s

    #url should still be the same
    ${current_url}=    Get Location
    Should Be Equal    ${current_url}    ${URL}Schedule


    Close All Browsers


4-4 Missing Location
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0
    
    Login to Profile
    Click Link    locator=/Schedule
    Click Button    id=view_schedule_btn
    
    Input Text    id=user_date    ${date}
    Click Button    id=reserve_btn

    Sleep    2s

    Wait Until Element Is Visible    id=error_box
    ${error_message}=    Get Text    id=error_message
    Should Be Equal    ${error_message}    Please fill out all fields.

    Close All Browsers


4-6 Driver Downloading Schedule
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0
    
    Login to Driver Profile
    Open a Schedule
    Wait Until Element Is Visible    id=print_schedule

    

    Close All Browsers






    