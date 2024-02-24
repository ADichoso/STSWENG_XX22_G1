const securityController = require('../controllers/securityController.js');
const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');

const bcrypt = require('bcrypt');
var req = {};
var res = { status: jest.fn().mockReturnThis() }; // Initialize res with status property

const db = require('../models/db.js');
const { query } = require('express');

jest.mock('../models/db.js');
jest.mock('bcrypt');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');

describe('SecurityController - getSecurity', () => {
    test('getSecurity should render if the id is an Admin id', async () => {      
        req = {query: {idNumber: 99999999}};
        res = {render: jest.fn()};
        // User findOne call returns false, Admin findOne call returns true
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce({idNumber: 99999999});

        await securityController.getSecurity(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: 99999999}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: 99999999}, 'idNumber');

        expect(res.render).toHaveBeenCalledWith('Security', {idNumber: 99999999});
    });

    test('getSecurity should render if the id is a User id', async () => {
        req = {query: {idNumber: 12345678}};
        res = {render: jest.fn()};
        // User findOne call returns true, Admin findOne call returns false
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({idNumber: 12345678}).mockResolvedValueOnce(null);

        await securityController.getSecurity(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: 12345678}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: 12345678}, 'idNumber');

        expect(res.render).toHaveBeenCalledWith('Security', {idNumber: 12345678});
    });
});

describe('SecurityController - postSecurity', () => {
    test('postSecurity should redirect to /ProfileAdmin if the id is an Admin id and the Security Code is correct', async () => {
        req = {body: {idNumber: '99999999', user_securityCode: '1234'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce({idNumber: '99999999', securityCode: '1234'});
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '99999999'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '99999999'}, {idNumber: 1, securityCode: 1});
        expect(bcrypt.compare).toHaveBeenCalledWith('1234', '1234');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/ProfileAdmin?idNumber=99999999');
    });

    test('postSecurity should redirect to /Profile if the id is a User id and the Security Code is correct', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({idNumber: '12345678', securityCode: '1234'}).mockResolvedValueOnce(null);
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/Profile?idNumber=12345678');
    });

    test('postSecurity should render Login if the Security Code is incorrect', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {render: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({idNumber: '12345678', securityCode: '12345'}).mockResolvedValueOnce(null);
        bcrypt.compare.mockResolvedValueOnce(false);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('Login', {isCodeCorrect: false});
    });

    test('postSecurity should render Login if the id is not found', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {render: jest.fn()};

        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(res.render).toHaveBeenCalledWith('Login', {isCodeCorrect: false});
    });
});
