/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';

import { db } from './database/db.js';
import {
  authenticateToken,
  loginUser,
  registerUser,
} from './controllers/auth.controller.js';
import {
  listUserTransactions,
  postNewTransaction,
} from './controllers/transactions.controller.js';

const app = express();
app.use(cors());
app.use(express.json());

async function removeInactiveUsers() {
  const now = Date.now();
  const sessionLimit = now - 1000 * 60 * 20;
  await db
    .collection('sessions')
    .deleteMany({ timestamp: { $lte: sessionLimit } });
}

setInterval(removeInactiveUsers, 300000);

app.post('/signup', registerUser);

app.post('/login', loginUser);

app.post('/login/sessions', authenticateToken);

app.get('/transactions', listUserTransactions);

app.post('/transactions', postNewTransaction);

app.listen(5000, () => console.log('Listening on port 5000'));
