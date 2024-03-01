const loginController = require('../controllers/loginController');
const db = require('../models/db.js');
const bcrypt = require('bcrypt');
const user = require('../models/userdb.js');
const admin = require('../models/admindb.js');
const driver = require('../models/driverdb.js');

jest.mock('../models/db.js');
jest.mock('bcrypt');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');


/*
*   Database call order: user -> admin -> driver
*/

describe('loginController', () => {
  describe('get_login', () => {
    test('should only render login page if session does not exist', async () => {
      const req = { session: {} }; // session does not exist
      const res = { render: jest.fn() }; // mock render function

      await loginController.get_login(req, res); // act the function

      expect(res.render).toHaveBeenCalledWith('Login');
    });

    test('should redirect to user profile if user is found in user collection', async () => {
      const req = { session: { id_number: '12196290' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(true);

      await loginController.get_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '12196290' }, { id_number: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/Profile?id_number=12196290');
    });

    test('should redirect to admin profile if user is found in admin collection', async () => {
      const req = { session: { id_number: '123456789' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await loginController.get_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(admin, { id_number: '123456789' }, { id_number: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/ProfileAdmin?id_number=123456789');
    });

    test('should redirect to driver profile if user is found in driver collection', async () => {
      const req = { session: { id_number: '123456789' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await loginController.get_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(admin, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(driver, { id_number: '123456789' }, { id_number: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/ProfileDriver?id_number=123456789');
    });

    test('should render login page with is_valid false if account not foudn', async () => {
      const req = { session: { id_number: '123456789' } };
      const res = { render: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValue(false);

      await loginController.get_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(admin, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(driver, { id_number: '123456789' }, { id_number: 1 });
      expect(res.render).toHaveBeenCalledWith('Login', { is_valid: false });
    });
  });

  describe('post_login', () => {
    test('should redirect to SecurityCheck page if login is successful', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce({ id_number: '123456789', password: 'hashed' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.post_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.id_number).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?id_number=123456789');
    });

    test('should redirect to SecurityCheck page if admin login is successful', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(false).mockResolvedValueOnce({ id_number: '123456789', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.post_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(admin, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.id_number).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?id_number=123456789');
    });

    test('should redirect to SecurityCheck page if driver login is successful', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValueOnce({ id_number: '123456789', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.post_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(admin, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(driver, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.id_number).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?id_number=123456789');
    });

    test('should render login page with is_valid false if login fails', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { render: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockResolvedValueOnce(false);

      await loginController.post_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(res.render).toHaveBeenCalledWith('Login', { is_valid: false });
    });

    test('should handle error by sending 500 status', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'find_one').mockRejectedValueOnce('Error');

      await loginController.post_login(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(user, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error');
    });
  });
});
