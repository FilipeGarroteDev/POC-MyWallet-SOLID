/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { db } from '../database/db.js';

async function tokenValidation(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .send(
        'Você não tem autorização para acessar essa página.\nPor gentileza, faça o login.'
      );
  }

  try {
    const authUser = await db.collection('sessions').findOne({ token });
    if (!authUser) {
      return res
        .status(401)
        .send(
          'O seu acesso à página está expirado.\nPor gentileza, refaça o login.'
        );
    }

    res.locals.user = authUser;

    next();
  } catch (error) {
    res.status(400).send(error.message);
    next();
  }
}

export { tokenValidation };
