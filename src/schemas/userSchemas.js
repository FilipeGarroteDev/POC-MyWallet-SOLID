import joi from 'joi';

const newUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.required(),
});

export { newUserSchema, loginSchema };
