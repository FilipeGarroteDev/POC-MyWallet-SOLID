/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import transactionRouter from './routes/transactionsRoutes.js';
import { db } from './database/db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(transactionRouter);

async function removeInactiveUsers() {
  const now = Date.now();
  const sessionLimit = now - 1000 * 60 * 20;
  await db
    .collection('sessions')
    .deleteMany({ timestamp: { $lte: sessionLimit } });
}

setInterval(removeInactiveUsers, 300000);

app.listen(5000, () => console.log('Listening on port 5000'));
