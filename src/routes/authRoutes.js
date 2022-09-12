/* eslint-disable import/extensions */
import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { searchUser } from '../middlewares/searchUserMiddleware.js';
import { tokenValidation } from '../middlewares/tokenValidationMiddleware.js';

const router = express.Router();

router.post(
  '/login/sessions',
  tokenValidation,
  authController.authenticateToken
);
router.delete('/session/:token', authController.deleteClosedSession);

router.use(searchUser);
router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);

export default router;
