import validators from "../../validator/index.js"
import models from "../../model/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import env from "dotenv"

env.config()
const JWT_SECRET = process.env.JWT_SECRET

const signUpService = async (userData) => {
    try {
        const isValidData = validators.userSchema.validate(userData);
        if (isValidData.error) {
            return { type: "error", message: isValidData.error.details[0].message, status: 400 };
        }
        const { email, userName, password } = userData;
        const userExist = await models.User.findOne({ $or: [{ email }, { userName }] });
        if (userExist) {
            if (userExist.email == email) {
                return { type: "error", message: `User with email ${email} already exist`, status: 409 };
            }
            return { type: "error", message: `User with username ${userName} already exist`, status: 409 };;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await models.User.create({ userName, email, password: hashedPassword });
        return { type: "success", message: "User created successfully", data: createdUser, status: 201 };
    } catch (error) {
        return { type: "error", message: "Internal Server Error", status: 500 };
    };
};

const loginService = async (userData) => {
    try {
        const {userName, password} = userData;
        const user = await models.User.findOne({ userName });
        if (!user) {
            return { type: "error", message: `Invalid Username or password`, status: 404 };
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return { type: "error", message: "Invalid Username or password", status: 401 };
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
        return { type: "success", message: "User logged in successfully", data: { token }, status: 200 };
    } catch (error) {
        console.log(error);
        return { type: "error", message: "Internal Server Error", status: 500 };
    };
};

const generateForgotPasswordOTP = async (email) => {
    try {
        const user = await models.User.findOne({ email });
        if (!user) {
            return { type: "error", message: `User with email ${email} does not exist`, status: 404 };
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpGenerated = await models.Otp.findOneAndUpdate({ user: user._id }, { otp }, { new: true, upsert: true });
        return { type: "success", message: "OTP generated successfully and is valid for 5 minutes only.", data: {warning:"In production this OTP would be sent via email it wont be present in the response.",otpGenerated:otpGenerated.otp, userId:user._id}, status: 200 };
    } catch (error) {
        return { type: "error", message: "Internal Server Error", status: 500 };
    }
}

const forgotPasswordService = async (userData) => {
    try {
        const { otp, password, userId } = userData;
        const otpExist = await models.Otp.findOneAndDelete({ otp, user: userId });
        if (!otpExist) {
            return { type: "error", message: "Invalid OTP", status: 404 };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await models.User.findOneAndUpdate({ _id: userId }, { password: hashedPassword });
        if(!updatedUser){
            return { type: "error", message: "Something went wrong", status: 500 };
        }
        return { type: "success", message: "Password changed successfully", status: 200 };
    } catch (error) {
        console.log(error)
        return { type: "error", message: "Internal Server Error", status: 500 };
    }
}

export default {
    signUpService,
    loginService,
    generateForgotPasswordOTP,
    forgotPasswordService
}