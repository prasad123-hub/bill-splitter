const model = require('../models/schema');
const bcrypt = require('bcryptjs');
const validator = require("../helpers/validation");
const logger = require('../helpers/logger');
const apiAuthentication = require('../helpers/apiAuthentication');


/*
User Registration function
Accepts : firstname,lastname,email,password
Validation : firstname,lastname not null
             emailId - contain '@' and '.com
             password - min 8, lowercase, uppercase, special character, numbers
API - users/v1/register
*/

exports.userReg = async (req,res) => {
    try {
        // checking email ID exists in the DB
        const user  = await model.User.findOne({ emailId: req.body.emailId });
        // if email ID exists then return error
        if(user) {
            const err = new Error("Email ID already exists in the database, Please Login!")
            err.status = 400
        } else {
            // accepts the inputs and create user model from req.body
            const newUser = new model.User(req.body)
            // Performing validations
            if (validator.emailValidation(newUser.emailId) &&
                validator.passwordValidation(newUser.password) &&
                validator.notNull(newUser.firstName)) {
                //Bcrypt password encription
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(newUser.password, salt)

                //storing user details in DB
                const id = await model.User.create(newUser)
                res.status(200).json({
                    status: "Success",
                    message: "User Registeration Success",
                    userId: id.id
                })
            }
            
        }
    } catch (err) {
        logger.error(`URL - ${req.originalUrl} | status : ${err.status} | message : ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
User Login Function
Accepts : email,password
API - users/v1/login
TODO: Implement google sign in
*/

exports.userLogin = async(req,res) => {
    try {
        // checking email exists in the DB
        const user = await model.User.findOne({ emailId: req.body.emailId });

        if(!user) {
            const err = new Error("Email ID does not exists in the database, Please Register!")
            err.status = 400
            throw err   
        }

        // checking password is correct using bcryptjs
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch) {
            const err = new Error("Password is incorrect, Please try again!")
            err.status = 400
            throw err
        } else {
            const accessToken = apiAuthentication.generateAcceessToken(req.body.emailId)
            res.status(200).json({
                status: "Success",
                message : "User Login Success",
                userId : user.id,
                emailId : user.emailId,
                firstName : user.firstName,
                lastName : user.lastName,
                accessToken
            })
        }
    } catch (err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message} ${err.stack}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
User Details funtion
Accepts : user email id
Returns : user details (ensure password is removed)
*/

exports.userDetails = async(req,res) => {
    try {
        // check if login user is same as requested user
        apiAuthentication.validateUser(req.user, req.body.emailId)
        const user = await model.User.findOne({ emailId: req.body.emailId },{password : 0})
        if(!user) { 
            const err = new Error("User does not exist")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            user: user
        })
    } catch (err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
View All Users Email Function
Accepts : none
Returns : all users email id
*/

exports.emailList = async(req,res) => {
    try {
        // check if login user is same as requested user
        const userEmails = await model.User.find({},{emailId : 1, _id : 0})
        if(!userEmails) {
            const err = new Error("No users exist")
            err.status = 400
            throw err
        }
        const emailList = []
        for(const email of userEmails) {
            emailList.push(email.emailId)
        }

        res.status(200).json({
            status: "Success",
            users : emailList
        })
    } catch(err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
Delete User function 
This function is used to delete an existing user in the database 
Accepts: user email id 
*/
exports.deleteUser = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        apiAuthentication.validateUser(req.user, req.body.emailId)
        const userCheck = await validator.userValidation(req.body.emailId)
        if (!userCheck) {
            var err = new Error("User does not exist!")
            err.status = 400 
            throw err
        }
        const delete_response = await model.User.deleteOne({
            emailId: req.body.emailId
        })
        res.status(200).json({
            status: "Success",
            message: "User Account deleted!",
            response: delete_response
        })
    } catch (err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
Edit User function 
This function is used to edit present user in the database 
Accepts: user data (email can not be changed)
This function is not used to change password
*/

exports.editUser = async (req, res) => {
    try {
        // check if logged in user is same as requested user
        apiAuthentication.validateUser(req.user, req.body.emailId)
        const userCheck = await validator.userValidation(req.body.emailId)
        if (!userCheck) {
            var err = new Error("User does not exist!")
            err.status = 400 
            throw err
        }
        
        // Accepts the input and create user model from req.body
        const editUser = req.body
        // Performing validations
        if(validator.notNull(editUser.firstName) && validator.notNull(editUser.lastName)) {
            const update_response = await model.User.updateOne({
                emailId: req.body.emailId
            }, {
                $set : {
                    firstName: editUser.firstName,
                    lastName: editUser.lastName
                }
            })
            res.status(200).json({
                status: "Success",
                message: "User Account updated!",
                response: update_response
            })
        }
    } catch (err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
Update password function
This function is used to update password of an existing user in the database
Accepts : user email id , old password , new password
Validation : old password should be correct, new password should meet the requirements
*/

exports.updatePassword = async (req, res) => {
    try {
        // check if logged in user is same as requested user
    apiAuthentication.validateUser(req.user, req.body.emailId)
    const user = await model.User.findOne({ emailId: req.body.emailId })
    if(!user) {
        const err = new Error("User does not exist")
        err.status = 400
        throw err
    }

    // performing basic validations
    validator.notNull(req.body.oldPassword)
    validator.passwordValidation(req.body.newPassword)

    // validating password using bcrypt
    const isValidPassword = await bcrypt.compare(req.body.oldPassword, user.password)
    if(!isValidPassword) {
        const err = new Error("Old password is incorrect")
        err.status = 400
        throw err
    }

    // hashing the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
    const update_response = await model.User.updateOne({
        emailId : req.body.emailId
    }, {
        $set : {
            password : hashedPassword
        }
    })
    res.status(200).json({
        status: "Success",
        message: "Password updated!",
        userId: update_response
    })
    } catch (err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}