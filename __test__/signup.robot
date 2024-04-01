*** Settings ***
Name              SignUp Test Suite
Documentation     A test suite for valid user/admin/driver signup
...
...               This test has a workflow that is created using keywords
...               directly from SeleniumLibrary.
Library           SeleniumLibrary
Library    XML

*** Variables ***
${URL}    https://sweng-testing-ci.onrender.com/SignUp
${BROWSER}    Chrome

*** Test Cases ***
1-1 Valid Access
    Open Browser    http://localhost:3000/SignUp    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${first_name} =    Set Variable    Test
    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@test.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    ${first_name}
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']
    
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_first_name

    #Press signup button
    Wait Until Element Is Enabled    id=submit
    Click Element    id=submit

    #Check if the user is redirected to login
    #Checks for a message that says You have successfully signed up
    Wait Until Element Is Visible    id=success_box
    Sleep    2s
    Close Browser

1-2 Missing First Name
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@test.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']
    
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_first_name
    Input Text    id=user_first_name    ${EMPTY}
    Press Keys    id=user_first_name    \DELETE
    Click Element    id=user_last_name
    Wait Until Element Is Visible    id=error_box
    
    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Should Be Equal    ${error_message}    First name should not be empty.

    Close Browser

1-3 Missing Last Name
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@test.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234
    
    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}
        
    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']
    
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_last_name
    Press Keys    id=user_last_name    \DELETE
    Press Keys    id=user_last_name    \DELETE
    Click Element    id=user_first_name
    Wait Until Element Is Visible    id=error_box
    Sleep    2s
    
    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    Last name should not be empty.
    Close Browser

1-4 Missing Email
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@test.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']
    
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_email
    Press Keys    id=user_email    \DELETE
    Click Element    id=user_first_name
    Wait Until Element Is Visible    id=error_box
    Sleep    2s

    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    Invalid Email.
    Close Browser

1-5 Email Already Registered
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    mauilopez@gmail.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']

    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_first_name
    
    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    Email already registered.
    Close Browser

1-6 Incorrect Email Format
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    test
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']

    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_first_name

    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    Invalid Email.
    Close Browser
    
1-7 Missing ID Number    
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@gmail.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']

    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    
    Click Element    id=id_number
    Press Keys    id=id_number    \DELETE
    Wait Until Element Is Visible    id=error_box
    Sleep    2s

    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    ID number should not be empty.
    Close Browser

1-8 Incorrect ID Number Format
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@gmail.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}

    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']
    
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_first_name
        
    Click Element    id=id_number
    Input Text    id=id_number    1234


    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Should Be Equal    ${error_message}    ID number should contain exactly 8 digits.

    Clear Element Text    id=id_number
    Input Text    id=id_number    test
    Click Element    id=user_first_name
    Sleep    1s

    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    ID number should contain only numbers.
    Close Browser

1-9 Missing Password
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))

    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@gmail.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234

    #Input fields
    Input Text    id=user_first_name    Test
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']
        
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']

    Click Element    id=user_password   
    Press Keys    id=user_password    \DELETE
    Click Element    id=user_first_name

    #Check the error message
    ${error_message} =    Get Text    id=error_box
    Sleep    2s
    Should Be Equal    ${error_message}    Password should not be empty.
    Close Browser
    
1-10 Missing Destination
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))
    ${first_name} =    Set Variable    Test
    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@gmail.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234
    
    #Input fields
    Input Text    id=user_first_name    ${first_name}
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}
        
    #select Type of Passenger
    Click Element    id=user_passenger_type
    Click Element    xpath=//option[@value='Employee']
    Click Element    id=user_first_name

    #click signup
    Click Button    id=submit
    ${new_url} =    Get Location
    Sleep    2s
    Should Be Equal    ${new_url}    ${URL}

1-11 Missing Passenger Type
    Open Browser    http://localhost:3000/SignUp    Chrome
    Maximize Browser Window
    Set Selenium Speed    0.1

    #Constants
    ${random} =    Evaluate    str(random.randint(10000000, 99999999))
    ${first_name} =    Set Variable    Test
    ${last_name} =    Set Variable    User
    ${email} =    Set Variable    ${random}@gmail.com
    ${id_number} =    Set Variable    ${random}
    ${password} =    Set Variable    1234
    ${security_code} =    Set Variable    1234
    
    #Input fields
    Input Text    id=user_first_name    ${first_name}
    Input Text    id=user_last_name    ${last_name}
    Input Text    id=user_email    ${email}
    Input Text    id=id_number    ${id_number}
    Input Text    id=user_password    ${password}
    Input Text    id=user_security_code    ${security_code}

    #select Designation
    Click Element    id=user_designation
    Click Element    xpath=//option[@value='Student']

    Click Element    id=user_first_name

    #click signup
    Click Button    id=submit
    ${new_url} =    Get Location
    Sleep    2s
    Should Be Equal    ${new_url}    ${URL}

1-12 Navigation to Home "/"
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #click home
    Click Image    locator=//img[@src='../images/Leftarrow.png']
    ${new_url} =    Get Location
    Should Be Equal    ${new_url}    https://sweng-testing-ci.onrender.com/
    Close Browser

1-13 Navigation to Login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.1

    #click login
    Click Link    Login
    ${new_url} =    Get Location
    Should Be Equal    ${new_url}    https://sweng-testing-ci.onrender.com/Login
    Close All Browsers

