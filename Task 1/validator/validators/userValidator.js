import Joi from "joi";


const userSchema = Joi.object({
    userName: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .min(8),
});


export default userSchema;