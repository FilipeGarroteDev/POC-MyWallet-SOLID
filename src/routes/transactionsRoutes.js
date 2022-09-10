/* eslint-disable import/extensions */
import express from 'express';
import * as transactionsRouter from '../controllers/transactions.controller.js';

const route = express.Router();

route.get('/transactions', transactionsRouter.listUserTransactions);
route.post('/transactions', transactionsRouter.postNewTransaction);

export default route;
