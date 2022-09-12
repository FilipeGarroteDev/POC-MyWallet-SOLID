/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { ObjectId } from 'mongodb';
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

async function deleteTransaction(req, res) {
  const transactionId = req.params.id;
  const authUser = res.locals.user;

  try {
    const transaction = await db
      .collection('transactions')
      .findOne({ _id: ObjectId(transactionId) });

    if (authUser.userId.toString() !== transaction.userId.toString()) {
      return res
        .status(401)
        .send(
          'Você não é o dono dessa transação e, portanto, não pode excluí-la!'
        );
    }

    await db.collection('transactions').deleteOne({ _id: transaction._id });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

async function editTransaction(req, res) {
  const newTransaction = req.body;
  const transactionId = req.params.id;
  const authUser = res.locals.user;

  try {
    const transaction = await db
      .collection('transactions')
      .findOne({ _id: ObjectId(transactionId) });

    if (authUser.userId.toString() !== transaction.userId.toString()) {
      return res
        .status(401)
        .send(
          'Você não é o dono dessa transação e, portanto, não pode editá-la!'
        );
    }

    await db
      .collection('transactions')
      .updateOne({ _id: transaction._id }, { $set: newTransaction });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export {
  listUserTransactions,
  postNewTransaction,
  deleteTransaction,
  editTransaction,
};
