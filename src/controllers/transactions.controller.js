/* eslint-disable import/extensions */
import { db } from '../database/db.js';

async function listUserTransactions(req, res) {
  const authUser = res.locals.user;
  const transactions = await db
    .collection('transactions')
    .find({ userId: authUser.userId })
    .toArray();

  return res.status(200).send(transactions);
}

async function postNewTransaction(req, res) {
  const transaction = req.body;
  const authUser = res.locals.user;

  await db.collection('transactions').insertOne({
    ...transaction,
    userId: authUser.userId,
  });

  return res.sendStatus(201);
}

export { listUserTransactions, postNewTransaction };
