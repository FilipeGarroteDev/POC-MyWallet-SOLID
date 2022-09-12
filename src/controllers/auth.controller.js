/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../database/db.js';
import { newUserSchema, loginSchema } from '../schemas/userSchemas.js';

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  const validation = newUserSchema.validate(
    { name, email, password },
    { abortEarly: false }
  );
  const hasThisEmail = res.locals.user;

  if (hasThisEmail) {
    return res
      .status(409)
      .send('Já existe um usuário com esse e-mail.\nInsira um e-mail válido');
  }

  if (validation.error) {
    const errors = validation.error.details
      .map((error) => error.message)
      .join('\n');
    return res.status(400).send(errors);
  }

  try {
    await db.collection('users').insertOne({
      name,
      email,
      password: encryptedPassword,
    });
    return res.sendStatus(201);
  } catch (error) {
    return console.log(error.message);
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const token = uuid();
  const validation = loginSchema.validate({ email, password });

  if (validation.error) {
    return res
      .status(400)
      .send(
        'Formato inválido de dados. O e-mail deve ter formato de email (xxx@xxx.xxx) e a senha não pode ser vazia'
      );
  }

  try {
    const { user } = res.locals;
    const passwordIsValid = bcrypt.compareSync(
      password,
      user ? user.password : ' '
    );

    if (!user || !passwordIsValid) {
      return res
        .status(401)
        .send('Usuário ou senha inválidos. Revise seus dados.');
    }

    await db.collection('sessions').insertOne({
      userId: user._id,
      token,
      timestamp: Date.now(),
    });

    return res.status(201).send(token);
  } catch (error) {
    return res.status(401).send(error.message);
  }
}

async function authenticateToken(req, res) {
  const authUser = res.locals.user;

  const loggedUser = await db
    .collection('users')
    .findOne({ _id: authUser.userId });

  delete loggedUser.password;
  return res.status(200).send(loggedUser);
}

async function deleteClosedSession(req, res) {
  const { token } = req.params;

  try {
    await db.collection('sessions').deleteOne({ token });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function removeInactiveUsers() {
  const now = Date.now();
  const sessionLimit = now - 1000 * 60 * 20;
  await db
    .collection('sessions')
    .deleteMany({ timestamp: { $lte: sessionLimit } });
}

setInterval(removeInactiveUsers, 300000);

export { registerUser, loginUser, authenticateToken, deleteClosedSession };
