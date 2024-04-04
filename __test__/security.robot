*** Settings ***
Name              SecurityCode Test Suite
Documentation     A test suite for valid security code input. Needs the accounts from test_accounts.js to run.
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary

*** Variables ***
${URL}    https://sweng-testing-ci.onrender.com/
${BROWSER}    headlesschrome
${account_id}    34433443
${account_password}    3443
${account_security_code}    3443

${admin_id}    89898989
${admin_password}    8989
${admin_security_code}    8989

${driver_id}    45544554
${driver_password}    4554
${driver_security_code}    4554



*** Keywords ***
Login With account
    [Arguments]   ${id}    ${password}    ${security_code}    ${type}    ${isFail}
    Open Browser    ${URL}login    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1
    Input Text    id=user_id_number    ${id}
    Input Text    id=user_password    ${password}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${URL}SecurityCheck?id_number=${id}
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${security_code}
    Click Button    xpath=//button[@type='submit']

    Run Keyword If    '${isFail}' == 'False'    Login With account.ValidCheck    ${id}    ${password}    ${type}

Login With account.ValidCheck
    [Arguments]    ${id}    ${password}    ${type}
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${URL}${type}?id_number=${id}
    Close All Browsers


*** Test Cases ***
3-1 Valid Security Code
    Login With account    ${account_id}    ${account_password}    ${account_security_code}    Profile    False

    Login With account    ${admin_id}    ${admin_password}    ${admin_security_code}    ProfileAdmin    False

    Login With account    ${driver_id}    ${driver_password}    ${driver_security_code}    ProfileDriver    False
3-2 Invalid Security Code
    Login With account    ${account_id}    ${account_password}    2222    Profile    True
    Wait Until Element Is Visible    id=error_box
    Page Should Contain    Security code is incorrect. Please try again.
    Close All Browsers
