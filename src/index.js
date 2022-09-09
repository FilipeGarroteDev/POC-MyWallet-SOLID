/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log('Listening on port 5000'));
