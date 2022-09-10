/* eslint-disable import/extensions */
import express from 'express';
import * as transactionsRouter from '../controllers/transactions.controller.js';
import { tokenValidation } from '../middlewares/tokenValidation.js';

const route = express.Router();
route.use(tokenValidation);
route.get('/transactions', transactionsRouter.listUserTransactions);
route.post('/transactions', transactionsRouter.postNewTransaction);

export default route;
