const Joi = require('joi');

const validateRegisterData = (data) =>{
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$#!%*?&]{8,30}$')).required()
    });

    return schema.validate(data);
}

const validateLoginData = (data)=>{
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$#!%*?&]{8,30}$')).required()
    });

    return schema.validate(data);
}

const validateBookingData = (data)=>{
    const schema = Joi.object({
        train_id:Joi.number().required(),
        seats:Joi.number().required(),
        user_id:Joi.number().required(),
        date:Joi.date().required()
    });

    return schema.validate(data);
}

const validateTrainData = (data)=>{
    const schema = Joi.object({
        train_id:Joi.number().required(),
        source:Joi.string().required(),
        destination:Joi.string().required(),
        seats_counter:Joi.number().required(),
        seats_available:Joi.number().required()
    });

    return schema.validate(data);
}

exports.validateRegisterData = validateRegisterData;
exports.validateLoginData = validateLoginData;
exports.validateBookingData = validateBookingData;