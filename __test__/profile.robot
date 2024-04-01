*** Settings ***
Name              Profile Test Suite
Documentation     A test suite for testing the profile page of the application.
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary


*** Variables ***
${BROWSER}    Chrome
${URL}    https://sweng-testing-ci.onrender.com/
${account_id}    34433443
${account_pass}    3443
${account_security_check}   3443


*** Keywords ***
Login to Profile
    Go To    url=${URL}login
    Input Text    id=user_id_number    ${account_id}
    Input Text    id=user_password    ${account_pass}
    Click Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${account_security_check}
    Click Button    xpath=//button[@type='submit']


*** Test Cases ***
5-1 Logging out
    Open Browser    ${URL}    ${BROWSER}
    Login to Profile
    Click Link    /Logout

    ${url}=    Get Location
    Should Be Equal    ${url}    ${URL}
    
    Go To    ${URL}
    ${login_button}=    Get Text    xpath=//*[@id="top"]/div[1]/ul/li[5]/a
    Should Be Equal    ${login_button}    LOGIN

    Close All Browsers

5-2 Checking the Displayed Profile
    Open Browser    ${URL}    ${BROWSER}
    Login to Profile

    ${id_number}=    Get Text    xpath=//*[@id="info_box"]/div/p
    Should Be Equal    ${id_number}    ${account_id}

    ${name}=    Get Text    xpath=//*[@id="info_box"]/p[1]
    Should Be Equal    ${name}    User User

    ${passenger_type}=    Get Text    xpath=//*[@id="info_box"]/p[2]

    Page Should Contain Element    id=profile_picture

    Close All Browsers
