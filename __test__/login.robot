*** Settings ***
Name              Login Test Suite
Documentation     A test suite for valid login.
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary

*** Test Cases ***
2-1 Valid Username and Password
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    34433443
    Input Text    id=user_password    3443
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=34433443
    Close Browser

2-2 Unsuccessful Login due to Incorrect Username
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    12170586
    Input Text    id=user_password    111111
    Click Button    xpath=//button[@type='submit']
    Wait Until Element Is Visible    id=error_box
    Page Should Contain    Invalid User/Password. Check your input
    Close Browser

2-3 Unseccessful Login due to Incorrect Password
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

2-4 Invalid Access to Login Page When there is a session of a User Account
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    34433443
    Input Text    id=user_password    3443
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=34433443
    Input Text    id=user_security_code    3443
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/Profile?id_number=34433443

    #Actual testing
    Go To    http://localhost:3000/login
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/Profile?id_number=34433443
    Close Browser

2-5 Invalid Access to Login Page When there is a session of an Admin Account
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    89898989
    Input Text    id=user_password    8989
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=89898989
    Input Text    id=user_security_code    8989
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/ProfileAdmin?id_number=89898989

    #Actual testing
    Go To    http://localhost:3000/login
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/ProfileAdmin?id_number=89898989
    Close Browser

2-6 Invalid Access to Login Page When there is a session of a Driver Account
    ${account}=   Create List    45544554    4554    4554
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1
    Page Should Contain Element    id=user_id_number
    Page Should Contain Element    id=user_password
    Input Text    id=user_id_number    ${account[0]}
    Input Text    id=user_password    ${account[1]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=${account[0]}
    Input Text    id=user_security_code    ${account[2]}
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/ProfileDriver?id_number=${account[0]}
    #Actual testing
    Go To    http://localhost:3000/login
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/ProfileDriver?id_number=${account[0]}
    Close All Browsers

