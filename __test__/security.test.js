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
jest.mock('../models/driverdb.js');

/*
*   Database call order: User -> Admin -> Driver
*/

describe('SecurityController - getSecurity', () => {
    test('getSecurity should render if the id is an Admin id', async () => {      
        req = {query: {idNumber: 99999999}};
        res = {render: jest.fn()};

        // User: null, Admin: {idNumber: 99999999}, Driver: null
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce({idNumber: 99999999}).mockResolvedValueOnce(null);

        await securityController.getSecurity(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: 99999999}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: 99999999}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: 99999999}, 'idNumber');

        expect(res.render).toHaveBeenCalledWith('Security', {idNumber: 99999999});
    });

    test('getSecurity should render if the id is a User id', async () => {
        req = {query: {idNumber: 12345678}};
        res = {render: jest.fn()};

        // User: {idNumber: 12345678}, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({idNumber: 12345678}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await securityController.getSecurity(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: 12345678}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: 12345678}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: 12345678}, 'idNumber');

        expect(res.render).toHaveBeenCalledWith('Security', {idNumber: 12345678});
    });

    test('getSecurity should render if the id is a Driver id', async () => {
        req = {query: {idNumber: 12345678}};
        res = {render: jest.fn()};

        // User: null, Admin: null, Driver: {idNumber: 12345678}
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({idNumber: 12345678});

        await securityController.getSecurity(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: 12345678}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: 12345678}, 'idNumber');
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: 12345678}, 'idNumber');

        expect(res.render).toHaveBeenCalledWith('Security', {idNumber: 12345678});
    });
});

describe('SecurityController - postSecurity', () => {
    test('postSecurity should redirect to /ProfileAdmin if the id is an Admin id and the Security Code is correct', async () => {
        req = {body: {idNumber: '99999999', user_securityCode: '1234'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        // User: null, Admin: {idNumber: 99999999, securityCode: 1234}, Driver: null
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce({idNumber: '99999999', securityCode: '1234'}).mockResolvedValueOnce(null);
        // Mock bcrypt.compare to return true, since the security code is correct
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '99999999'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '99999999'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: '99999999'}, {idNumber: 1, securityCode: 1});

        expect(bcrypt.compare).toHaveBeenCalledWith('1234', '1234');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/ProfileAdmin?idNumber=99999999');
    });

    test('postSecurity should redirect to /Profile if the id is a User id and the Security Code is correct', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        // User: {idNumber: 12345678, securityCode: 1234}, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({idNumber: '12345678', securityCode: '1234'}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        // Mock bcrypt.compare to return true, since the security code is correct
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/Profile?idNumber=12345678');
    });

    test('postSecurity should redirect to /ProfileDriver if the id is a Driver id and the Security Code is correct', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        // User: null, Admin: null, Driver: {idNumber: 12345678, securityCode: 1234}
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({idNumber: '12345678', securityCode: '1234'});
        // Mock bcrypt.compare to return true, since the security code is correct
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.postSecurity(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/ProfileDriver?idNumber=12345678');
    });

    test('postSecurity should render Login if the Security Code is incorrect', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {render: jest.fn()};

        // User: {idNumber: 12345678, securityCode: 12345}, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({idNumber: '12345678', securityCode: '12345'}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        // Mock bcrypt.compare to return false, since the security code is incorrect
        bcrypt.compare.mockResolvedValueOnce(false);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('Login', {isCodeCorrect: false});
    });

    test('postSecurity should render Login if the id is not found', async () => {
        req = {body: {idNumber: '12345678', user_securityCode: '1234'}};
        res = {render: jest.fn()};

        // User: null, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await securityController.postSecurity(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1})
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {idNumber: '12345678'}, {idNumber: 1, securityCode: 1});
        expect(res.render).toHaveBeenCalledWith('Login', {isCodeCorrect: false});
    });
});
