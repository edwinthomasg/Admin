const joi = require("joi")

const validate = async(payload, options) => {

     const registerSchema = joi.object({
        firstName: joi.string().min(2).max(15).required(),
        lastName: joi.string().required(),
        age: joi.number().min(18).max(50).required(),
        gender: joi.string().regex(new RegExp('^(male)$|^(female)$')).required(),
        experience: joi.string().regex(new RegExp('^(0)$|^(1)$|^(2)$|^(>=3)$')),
        company: joi.string(),
        college: joi.string(),
        contact: joi.string().regex(new RegExp('[6789]{1}[0-9]{9}$')).required(),
        email: joi.string().regex(new RegExp('^[a-z]+[a-z0-9]*[\.]?[a-z0-9]*@[a-z]+.com$')).required()
    })
    return await registerSchema.validateAsync(payload, options)
} 

module.exports = validate