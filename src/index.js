/* eslint-disable import/extensions */
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

const loginSchema = joi.object({
  email: joi.email().required(),
  password: joi.required(),
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  const validation = newUserSchema.validate(
    { name, email, password },
    { abortEarly: false }
  );
  const hasThisEmail = await db.collection('users').findOne({ email });
  const errors = validation.error.details
    .map((error) => error.message)
    .join('\n');

  if (hasThisEmail) {
    return res
      .status(409)
      .send('Já existe um usuário com esse e-mail.\nInsira um e-mail válido');
  }

  if (validation.error) {
    return res.status(400).send(errors);
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const token = uuid();
  const validation = loginSchema({ email, password });
  const user = await db.collection('users').findOne({ email });
  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (validation.error) {
    return res
      .status(400)
      .send(
        'Formato inválido de dados. O e-mail deve ter formato de email (xxx@xxx.xxx) e a senha não pode ser vazia'
      );
  }

  if (!user || !passwordIsValid) {
    return res
      .status(409)
      .send('Usuário ou senha inválidos. Revise seus dados.');
  }

  await db.collection('sessions').insertOne({
    userId: user._id,
    token,
  });

  return res.status(201).send(token);
});

app.listen(5000, () => console.log('Listening on port 5000'));
