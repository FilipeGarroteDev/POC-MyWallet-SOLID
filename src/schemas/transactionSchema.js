import joi from 'joi';

const transactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  date: joi.string().required(),
  type: joi.string().required().valid('entrada', 'saída'),
});

const editSchema = joi.object({
  value: joi.number(),
  description: joi.string(),
  date: joi.string(),
});

export { transactionSchema, editSchema };
