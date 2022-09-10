/* eslint-disable import/extensions */
import { db } from '../database/db.js';

async function listUserTransactions(req, res) {
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
    const transactions = await db
      .collection('transactions')
      .find({ userId: authUser.userId })
      .toArray();

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function postNewTransaction(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const transaction = req.body;

  if (!token) {
    return res
      .status(401)
      .send(
        'O seu acesso à página está expirado.\nPor gentileza, refaça o login.'
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
    await db.collection('transactions').insertOne({
      ...transaction,
      userId: authUser.userId,
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export { listUserTransactions, postNewTransaction };
