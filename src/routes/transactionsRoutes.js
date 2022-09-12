/* eslint-disable import/extensions */
import express from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';
import { tokenValidation } from '../middlewares/tokenValidationMiddleware.js';

const route = express.Router();
route.use(tokenValidation);
route.get('/transactions', transactionsController.listUserTransactions);
route.post('/transactions', transactionsController.postNewTransaction);
route.delete('/transactions/:id', transactionsController.deleteTransaction);
route.put('/transactions/:id', transactionsController.editTransaction);

export default route;
