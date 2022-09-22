/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import transactionRouter from './routes/transactionsRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(transactionRouter);

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
