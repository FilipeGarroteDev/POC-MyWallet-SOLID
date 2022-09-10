/* eslint-disable import/extensions */
import express from 'express';
import * as authRouter from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', authRouter.registerUser);
router.post('/login', authRouter.loginUser);
router.post('/login/sessions', authRouter.authenticateToken);

export default router;
