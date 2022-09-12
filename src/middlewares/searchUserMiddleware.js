/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { db } from '../database/db.js';

async function searchUser(req, res, next) {
  const { email } = req.body;
  try {
    const user = await db.collection('users').findOne({ email });
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
    next();
  }
}

export { searchUser };
