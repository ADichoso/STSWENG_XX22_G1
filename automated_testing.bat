@echo off

echo Installing Required Packages
pip install robotframework
pip install robotframework-seleniumlibrary

echo Running Test Scripts
node test_accounts.js
robot --outputdir ./__test__/output/ ./__test__/. 
python3 -m robot --outputdir ./__test__/output/ ./__test__/. 
py -m robot --outputdir ./__test__/output/ ./__test__/. 
