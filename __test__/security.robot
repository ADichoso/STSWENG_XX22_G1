*** Settings ***
Name              SecurityCode Test Suite
Documentation     A test suite for valid security code input. Needs the accounts from test_accounts.js to run.
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary

*** Test Cases ***
3-1 Valid Security Code
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1
    ${user_ account}    Create List    34433443    3443    3443
    Input Text    id=user_id_number    ${user_account[0]}
    Input Text    id=user_password    ${user_account[1]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=34433443
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${user_account[2]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/Profile?id_number=34433443
    Close All Browsers

    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1
    ${admin_account}    Create List    89898989    8989    8989
    Input Text    id=user_id_number    ${admin_account[0]}
    Input Text    id=user_password    ${admin_account[1]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=89898989
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${admin_account[2]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/ProfileAdmin?id_number=89898989
    Close All Browsers

    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1
    ${driver_account}   Create List    45544554    4554    4554
    Input Text    id=user_id_number    ${driver_account[0]}
    Input Text    id=user_password    ${driver_account[1]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=45544554
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    ${driver_account[2]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/ProfileDriver?id_number=45544554
    Close All Browsers
3-2 Invalid Security Code
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0

    Input Text    id=user_id_number    34433443
    Input Text    id=user_password    3443
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=34433443
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    1234
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Not Be Equal    ${url}    http://localhost:3000/Profile?id_number=34433443
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck
    Wait Until Element Is Visible    id=error_box
    Page Should Contain    Security code is incorrect. Please try again.
    Close All Browsers
