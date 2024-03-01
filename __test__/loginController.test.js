const loginController = require('../controllers/loginController');
const db = require('../models/db.js');
const bcrypt = require('bcrypt');
const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');
const Driver = require('../models/driverdb.js');

jest.mock('../models/db.js');
jest.mock('bcrypt');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');
jest.mock('../models/driverdb.js');


/*
*   Database call order: User -> Admin -> Driver
*/

describe('loginController', () => {
  describe('getLogin', () => {
    test('should only render login page if session does not exist', async () => {
      const req = { session: {} }; // session does not exist
      const res = { render: jest.fn() }; // mock render function

      await loginController.getLogin(req, res); // act the function

      expect(res.render).toHaveBeenCalledWith('Login');
    });

    test('should redirect to user profile if user is found in User collection', async () => {
      const req = { session: { id_number: '12196290' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(true);

      await loginController.getLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '12196290' }, { id_number: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/Profile?id_number=12196290');
    });

    test('should redirect to admin profile if user is found in Admin collection', async () => {
      const req = { session: { id_number: '123456789' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await loginController.getLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: '123456789' }, { id_number: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/ProfileAdmin?id_number=123456789');
    });

    test('should redirect to driver profile if user is found in Driver collection', async () => {
      const req = { session: { id_number: '123456789' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await loginController.getLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Driver, { id_number: '123456789' }, { id_number: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/ProfileDriver?id_number=123456789');
    });

    test('should render login page with is_valid false if account not foudn', async () => {
      const req = { session: { id_number: '123456789' } };
      const res = { render: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValue(false);

      await loginController.getLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: '123456789' }, { id_number: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Driver, { id_number: '123456789' }, { id_number: 1 });
      expect(res.render).toHaveBeenCalledWith('Login', { is_valid: false });
    });
  });

  describe('postLogin', () => {
    test('should redirect to SecurityCheck page if login is successful', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({ id_number: '123456789', password: 'hashed' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.postLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.id_number).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?id_number=123456789');
    });

    test('should redirect to SecurityCheck page if admin login is successful', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false).mockResolvedValueOnce({ id_number: '123456789', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.postLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.id_number).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?id_number=123456789');
    });

    test('should redirect to SecurityCheck page if driver login is successful', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValueOnce({ id_number: '123456789', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.postLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Admin, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(find_one_mock).toHaveBeenCalledWith(Driver, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.id_number).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?id_number=123456789');
    });

    test('should render login page with is_valid false if login fails', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { render: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false);

      await loginController.postLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(res.render).toHaveBeenCalledWith('Login', { is_valid: false });
    });

    test('should handle error by sending 500 status', async () => {
      const req = { body: { user_id_number: '123456789', user_password: 'password' }, session: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockRejectedValueOnce('Error');

      await loginController.postLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { id_number: '123456789' }, { id_number: 1, password: 1 });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error');
    });
  });
});
