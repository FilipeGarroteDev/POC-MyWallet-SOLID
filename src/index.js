/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';
import { db } from './database/db.js';

const app = express();
app.use(cors());
app.use(express.json());

const newUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.email().required(),
  password: joi.required(),
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  const validation = newUserSchema.validate({ name, email, password });

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    await db.collection('users').insertOne({
      name,
      email,
      password: encryptedPassword,
    });
    return res.send(201);
  } catch (error) {
    return console.log(error.message);
  }
});

app.listen(5000, () => console.log('Listening on port 5000'));
