import { isValidObjectId } from "mongoose";

const validateEmail = (email) => 
{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
};

const validateId = (id) => 
{
    return isValidObjectId(id)
};

const validatePassword = (password)=>
{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);

}

export {validateEmail,validateId,validatePassword}