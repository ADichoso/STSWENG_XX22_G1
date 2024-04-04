*** Settings ***
Name              Login Test Suite
Documentation     A test suite for valid login.
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary

*** Variables ***
${url}    https://sweng-testing-ci.onrender.com/
${browser}    headlesschrome
${account_id}    34433443
${account_password}    3443
${account_security_code}    3443

${admin_id}    89898989
${admin_password}    8989
${admin_security_code}    8989

${driver_id}    45544554
${driver_password}    4554
${driver_security_code}    4554



*** Test Cases ***
2-1 Valid Username and Password
    Open Browser    ${url}login    ${browser}
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=id_number
    Page Should Contain Element    id=user_password
    Input Text    id=id_number    ${account_id}
    Input Text    id=user_password     ${account_password}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}SecurityCheck?id_number=${account_id}
    Close Browser

2-2 Unsuccessful Login due to Incorrect Username
    Open Browser    ${url}login    ${browser}
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=id_number
    Page Should Contain Element    id=user_password
    Input Text    id=id_number    12170586
    Input Text    id=user_password    111111
    Click Button    xpath=//button[@type='submit']
    Close Browser

2-3 Unseccessful Login due to Incorrect Password
    Open Browser    ${url}login    ${browser}
    Maximize Browser Window
    Set Selenium Speed    0
    Page Should Contain Element    id=id_number
    Page Should Contain Element    id=user_password
    Input Text    id=id_number    12170585
    Input Text    id=user_password    password
    Click Button    xpath=//button[@type='submit']
    Close Browser

2-4 Invalid Access to Login Page When there is a session of a User Account
    Open Browser    ${url}login    ${browser}
    Maximize Browser Window
    Set Selenium Speed    0.1
    Page Should Contain Element    id=id_number
    Page Should Contain Element    id=user_password
    Input Text    id=id_number    ${account_id}
    Input Text    id=user_password    ${account_password}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}SecurityCheck?id_number=${account_id}
    Input Text    id=user_security_code    ${account_security_code}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}Profile?id_number=${account_id}

    #Actual testing
    Go To    ${url}login
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}Profile?id_number=${account_id}
    Close Browser

2-5 Invalid Access to Login Page When there is a session of an Admin Account
    Open Browser    ${url}login    ${browser}
    Maximize Browser Window
    Set Selenium Speed    0.1
    Page Should Contain Element    id=id_number
    Page Should Contain Element    id=user_password
    Input Text    id=id_number    ${admin_id}
    Input Text    id=user_password    ${admin_password}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}SecurityCheck?id_number=${admin_id}
    Input Text    id=user_security_code    ${admin_security_code}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}ProfileAdmin?id_number=${admin_id}

    #Actual testing
    Go To    ${url}login
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}ProfileAdmin?id_number=${admin_id}
    Close Browser

2-6 Invalid Access to Login Page When there is a session of a Driver Account
    Open Browser    ${url}login    ${browser}
    Maximize Browser Window
    Set Selenium Speed    0.1
    Page Should Contain Element    id=id_number
    Page Should Contain Element    id=user_password
    Input Text    id=id_number    ${driver_id}
    Input Text    id=user_password    ${driver_password}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}SecurityCheck?id_number=${driver_id}
    Input Text    id=user_security_code    ${driver_security_code}
    Click Button    xpath=//button[@type='submit']
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}ProfileDriver?id_number=${driver_id}    
    #Actual testing
    Go To    ${url}login
    ${new_url}   Get Location
    Should Be Equal    ${new_url}    ${url}ProfileDriver?id_number=${driver_id}
    Close All Browsers

