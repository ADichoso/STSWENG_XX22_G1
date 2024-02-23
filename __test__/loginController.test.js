const loginController = require('../controllers/loginController');
const db = require('../models/db.js');
const bcrypt = require('bcrypt');
const User = require('../models/userdb.js');
const Admin = require('../models/admindb.js');

jest.mock('../models/db.js');
jest.mock('bcrypt');
jest.mock('../models/userdb.js');
jest.mock('../models/admindb.js');

describe('loginController', () => {
  describe('getLogin', () => {
    test('should only render login page if session does not exist', async () => {
      const req = { session: {} }; // session does not exist
      const res = { render: jest.fn() }; // mock render function

      await loginController.getLogin(req, res); // act the function

      expect(res.render).toHaveBeenCalledWith('Login');
    });

    test('should redirect to user profile if user is found in User collection', async () => {
      const req = { session: { idNumber: '12196290' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const find_one_mock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(true);

      await loginController.getLogin(req, res);

      expect(find_one_mock).toHaveBeenCalledWith(User, { idNumber: '12196290' }, { idNumber: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/Profile?idNumber=12196290');
    });

    test('should redirect to admin profile if user is found in Admin collection', async () => {
      const req = { session: { idNumber: '123456789' } };
      const res = { status: jest.fn().mockReturnThis(), redirect: jest.fn() };
      const findOneMock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await loginController.getLogin(req, res);

      expect(findOneMock).toHaveBeenCalledWith(User, { idNumber: '123456789' }, { idNumber: 1 });
      expect(findOneMock).toHaveBeenCalledWith(Admin, { idNumber: '123456789' }, { idNumber: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/ProfileAdmin?idNumber=123456789');
    });

    test('should render login page with isValid false if neither user nor admin found', async () => {
      const req = { session: { idNumber: '123456789' } };
      const res = { render: jest.fn() };
      const findOneMock = jest.spyOn(db, 'findOne').mockResolvedValue(false);

      await loginController.getLogin(req, res);

      expect(findOneMock).toHaveBeenCalledWith(User, { idNumber: '123456789' }, { idNumber: 1 });
      expect(findOneMock).toHaveBeenCalledWith(Admin, { idNumber: '123456789' }, { idNumber: 1 });
      expect(res.render).toHaveBeenCalledWith('Login', { isValid: false });
    });
  });

  describe('postLogin', () => {
    test('should redirect to SecurityCheck page if first time login is successful', async () => {
      const req = { body: { user_idNumber: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const findOneMock = jest.spyOn(db, 'findOne').mockResolvedValueOnce({ idNumber: '123456789', password: 'hashed' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.postLogin(req, res);

      expect(findOneMock).toHaveBeenCalledWith(User, { idNumber: '123456789' }, { idNumber: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.idNumber).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?idNumber=123456789');
    });

    test('should redirect to SecurityCheck page if admin login is successful', async () => {
      const req = { body: { user_idNumber: '123456789', user_password: 'password' }, session: {} };
      const res = { redirect: jest.fn() };
      const findOneMock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false).mockResolvedValueOnce({ idNumber: '123456789', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValueOnce(true);

      await loginController.postLogin(req, res);

      expect(findOneMock).toHaveBeenCalledWith(User, { idNumber: '123456789' }, { idNumber: 1, password: 1 });
      expect(findOneMock).toHaveBeenCalledWith(Admin, { idNumber: '123456789' }, { idNumber: 1, password: 1 });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
      expect(req.session.idNumber).toBe('123456789');
      expect(res.redirect).toHaveBeenCalledWith('/SecurityCheck?idNumber=123456789');
    });

    test('should render login page with isValid false if login fails', async () => {
      const req = { body: { user_idNumber: '123456789', user_password: 'password' }, session: {} };
      const res = { render: jest.fn() };
      const findOneMock = jest.spyOn(db, 'findOne').mockResolvedValueOnce(false);

      await loginController.postLogin(req, res);

      expect(findOneMock).toHaveBeenCalledWith(User, { idNumber: '123456789' }, { idNumber: 1, password: 1 });
      expect(res.render).toHaveBeenCalledWith('Login', { isValid: false });
    });

    test('should handle error by sending 500 status', async () => {
      const req = { body: { user_idNumber: '123456789', user_password: 'password' }, session: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const findOneMock = jest.spyOn(db, 'findOne').mockRejectedValueOnce('Error');

      await loginController.postLogin(req, res);

      expect(findOneMock).toHaveBeenCalledWith(User, { idNumber: '123456789' }, { idNumber: 1, password: 1 });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error');
    });
  });
});
