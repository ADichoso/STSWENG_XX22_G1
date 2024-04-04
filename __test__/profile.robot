*** Settings ***
Name              Profile Test Suite
Documentation     A test suite for testing the profile page of the application.
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary


*** Variables ***
${BROWSER}    headlesschrome
${URL}    https://sweng-testing-ci.onrender.com/
${account_id}    34433443
${account_pass}    3443
${account_security_check}   3443


*** Keywords ***
Login to Profile
    Maximize Browser Window
    Set Selenium Speed    0.1
    Go To    url=${URL}login
    Input Text    id=id_number    ${account_id}
    Input Text    id=user_password    ${account_pass}
    Click Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${account_security_check}
    Click Button    xpath=//button[@type='submit']


*** Test Cases ***
5-1 Logging out
    Open Browser    ${URL}    ${BROWSER}
    Login to Profile
    Click Link    /Logout
    ${new_url}=    Get Location
    Should Be Equal    ${new_url}    ${URL}

    Close All Browsers

5-2 Checking the Displayed Profile
    Open Browser    ${URL}    ${BROWSER}
    Login to Profile

    ${id_number}=    Get Text    xpath=//*[@id="info_box"]/h6
    Should Be Equal    ${id_number}    ${account_id}

    ${name}=    Get Text    xpath=//*[@id="info_box"]/div[2]/h3
    Should Be Equal    ${name}    User User

    ${passenger_type}=    Get Text    xpath=//*[@id="info_box"]/div[2]/h4
    Should Be Equal    ${passenger_type}    Student


    Page Should Contain Element    id=profile_picture

    Close All Browsers
