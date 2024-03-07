*** Settings ***
Name              Login Test Suite
Documentation     A test suite for valid login.
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary

*** Test Cases ***
Login - Valid Username and Password
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    12170585
    Input Text    id=user_password    111111
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=12170585
    Close Browser
Login - Invalid Details
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    12170585
    Input Text    id=user_password    password
    Click Button    xpath=//button[@type='submit']
    Wait Until Element Is Visible    id=error_box
    Page Should Contain    Invalid User/Password. Check your input
    Close Browser