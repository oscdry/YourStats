import Joi from "joi";

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const usernameRegex = /^\S*$/;

export const getUserSchema = Joi.object({
    identifier: Joi.string().required(), // Asegura que el identificador sea requerido
});

export const updateUserSchema = Joi.object({
    username: Joi.string().optional(),
    mail: Joi.string().email().optional(),
    role: Joi.number().optional().min(0).max(1),
    password: Joi.string().optional(),
    password_confirmation: Joi.string().when('password', {
        is: Joi.exist(),
        then: Joi.required().valid(Joi.ref('password')),
        otherwise: Joi.optional()
    }),
}).min(1); // Asegura que al menos uno de los campos esté presente

export const createUserSchema = Joi.object({
    username: Joi.string().required().min(3).max(16),
    mail: Joi.string().email().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.required().valid(Joi.ref('password')),
});

export const updateUsernameSchema = Joi.object({
    username: Joi.string().required().min(3).max(16).regex(usernameRegex)
});