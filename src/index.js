/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import { db } from './database/db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log('Listening on port 5000'));
