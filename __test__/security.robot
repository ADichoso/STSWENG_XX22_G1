*** Settings ***
Name              SecurityCode Test Suite
Documentation     A test suite for valid security code input.
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary

*** Variables ***
${OUTPUT DIR}    ../automated_testing/output

*** Test Cases ***
Valid Access
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    Input Text    id=user_id_number    12170585
    Input Text    id=user_password    111111
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=12170585
    Close Browser

Invalid Access (Through URL WITHOUT id_number)
    Open Browser    http://localhost:3000/SecurityCheck    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    ${url}   Get Location

    #this should redirect to login page
    Should Not Be Equal    ${url}    http://localhost:3000/SecurityCheck
    Should Be Equal    ${url}    http://localhost:3000/login
    Close Browser
Invalid Access (Through URL WITH id_number)
    Open Browser    http://localhost:3000/SecurityCheck?id_number=12170585  Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    ${url}   Get Location

    #this should redirect to login page
    Should Not Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=12170585
    Should Be Equal    ${url}    http://localhost:3000/login
    Close Browser
Valid Security Code
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0
    Input Text    id=user_id_number    12170585
    Input Text    id=user_password    111111
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=12170585
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    1111
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/Profile?id_number=12170585
    Close Browser
Invalid Security Code
    Open Browser    http://localhost:3000/login    Chrome
    Maximize Browser Window
    Set Selenium Speed    0

    Input Text    id=user_id_number    12170585
    Input Text    id=user_password    111111
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck?id_number=12170585
    Page Should Contain Element   id=user_security_code
    Page Should Contain Button    xpath=//button[@type='submit']
    Input Text    id=user_security_code    1234
    Click Button    xpath=//button[@type='submit']
    ${url}   Get Location
    Should Not Be Equal    ${url}    http://localhost:3000/Profile?id_number=12170585
    Should Be Equal    ${url}    http://localhost:3000/SecurityCheck
    Wait Until Element Is Visible    id=error_box
    Page Should Contain    Security code is incorrect. Please try again.
    Close Browser
