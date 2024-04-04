const securityController = require('../controllers/securityController.js');
const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

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

describe('SecurityController - get_security', () => {
    test('get_security should render if the id is an Admin id', async () => {      
        req = {query: {id_number: 99999999}, session: {id_number: 99999999}};
        res = {render: jest.fn()};

        // User: null, Admin: {id_number: 99999999}, Driver: null
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 99999999}).mockResolvedValueOnce(null);

        await securityController.get_security(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 99999999}, 'id_number');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 99999999}, 'id_number');
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 99999999}, 'id_number');

        expect(res.render).toHaveBeenCalledWith('Security', {id_number: 99999999});
    });

    test('get_security should render if the id is a User id', async () => {
        req = {query: {id_number: 12345678}, session: {id_number: 12345678}};
        res = {render: jest.fn()};

        // User: {id_number: 12345678}, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: 12345678}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await securityController.get_security(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 12345678}, 'id_number');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 12345678}, 'id_number');
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 12345678}, 'id_number');

        expect(res.render).toHaveBeenCalledWith('Security', {id_number: 12345678});
    });

    test('get_security should render if the id is a Driver id', async () => {
        req = {query: {id_number: 12345678}, session: {id_number: 12345678}};
        res = {render: jest.fn()};

        // User: null, Admin: null, Driver: {id_number: 12345678}
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: 12345678});

        await securityController.get_security(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 12345678}, 'id_number');
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 12345678}, 'id_number');
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 12345678}, 'id_number');

        expect(res.render).toHaveBeenCalledWith('Security', {id_number: 12345678});
    });
});

describe('SecurityController - post_security', () => {
    test('post_security should redirect to /ProfileAdmin if the id is an Admin id and the Security Code is correct', async () => {
        req = {body: {id_number: '99999999', user_security_code: '1234'}, session: {is_sec_code_valid: false, id_number: '99999999'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        // User: null, Admin: {id_number: 99999999, security_code: 1234}, Driver: null
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: '99999999', security_code: '1234'}).mockResolvedValueOnce(null);
        // Mock bcrypt.compare to return true, since the security code is correct
        const compare_mock = jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        await securityController.post_security(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: 99999999}, "id_number");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: 99999999}, "id_number");
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: 99999999}, "id_number");

        expect(compare_mock).toHaveBeenCalledWith('1234', '1234');
        expect(req.session.is_sec_code_valid).toBe(true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/ProfileAdmin?id_number=99999999');
    });

    test('post_security should redirect to /Profile if the id is a User id and the Security Code is correct', async () => {
        req = {body: {id_number: '12345678', user_security_code: '1234'}, session: {is_sec_code_valid: true, id_number: '12345678'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        // User: {id_number: 12345678, security_code: 1234}, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: '12345678', security_code: '1234'}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        // Mock bcrypt.compare to return true, since the security code is correct
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.post_security(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: '12345678'}, "id_number security_code");

        expect(bcrypt.compare).toHaveBeenCalledWith('1234', '1234');
        expect(req.session.is_sec_code_valid).toBe(true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/Profile?id_number=12345678');
    });

    test('post_security should redirect to /ProfileDriver if the id is a Driver id and the Security Code is correct', async () => {
        req = {body: {id_number: '12345678', user_security_code: '1234'}, session: {is_sec_code_valid: true, id_number: '12345678'}};
        res = {status: jest.fn().mockReturnThis(), redirect: jest.fn()};

        // User: null, Admin: null, Driver: {id_number: 12345678, security_code: 1234}
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({id_number: '12345678', security_code: '1234'});
        // Mock bcrypt.compare to return true, since the security code is correct
        bcrypt.compare.mockResolvedValueOnce(true);

        await securityController.post_security(req, res);

        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: '12345678'}, "id_number security_code");
        
        expect(bcrypt.compare).toHaveBeenCalledWith('1234', '1234');
        expect(req.session.is_sec_code_valid).toBe(true);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/ProfileDriver?id_number=12345678');
    });

    test('post_security should render Login if the Security Code is incorrect', async () => {
        req = {body: {id_number: '12345678', user_security_code: '1234'}, session: {is_code_correct: false,id_number: '12345678'}};
        res = {render: jest.fn()};

        // User: {id_number: 12345678, security_code: 12345}, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({id_number: '12345678', security_code: '12345'}).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        // Mock bcrypt.compare to return false, since the security code is incorrect
        bcrypt.compare.mockResolvedValueOnce(false);

        await securityController.post_security(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: '12345678'}, "id_number security_code");

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('Login', {is_code_correct: false});
    });

    test('post_security should render Login if the id is not found', async () => {
        req = {body: {id_number: '12345678', user_security_code: '1234'}, session: {id_number: '12345678'}};
        res = {render: jest.fn()};

        // User: null, Admin: null, Driver: null
        const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await securityController.post_security(req, res);
        
        expect(find_one_mock).toHaveBeenCalledWith(User, {id_number: '12345678'}, "id_number security_code");
        expect(find_one_mock).toHaveBeenCalledWith(Admin, {id_number: '12345678'}, "id_number security_code")
        expect(find_one_mock).toHaveBeenCalledWith(Driver, {id_number: '12345678'}, "id_number security_code");
        expect(res.render).toHaveBeenCalledWith('Login', {is_code_correct: false});
    });
});