import services from "../../service/index.js"


const signUpController = async (req, res) => {
    try {
        const body = req.body;
        const addedUser = await services.authServices.signUpService(body);
        return res.status(addedUser.status).json({ type: addedUser.type, message: addedUser.message, data: addedUser.data ? addedUser.data : null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal Server Error." });
    }
}

const loginController = async (req, res) => {
    try {
        const body = req.body;
        const loggedInUser = await services.authServices.loginService(body);
        return res.status(loggedInUser.status).json({ type: loggedInUser.type, message: loggedInUser.message, data: loggedInUser.data ? loggedInUser.data : null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal Server Error." });
    }
};

const otpGeneratingController = async (req, res) => {
    try {
        const { email } = req.query;
        const generatedOtp = await services.authServices.generateForgotPasswordOTP(email);
        return res.status(generatedOtp.status).json({ type: generatedOtp.type, message: generatedOtp.message, data: generatedOtp.data ? generatedOtp.data : null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal Server Error." });
    }
};

const forgotPasswordController = async (req, res) => {
    try {
        const body = req.body;
        const forgotPassword = await services.authServices.forgotPasswordService(body);
        return res.status(forgotPassword.status).json({ type: forgotPassword.type, message: forgotPassword.message, data: forgotPassword.data ? forgotPassword.data : null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ type: "error", message: "Internal Server Error." });
    }
}

export default {
    signUpController,
    loginController,
    otpGeneratingController,
    forgotPasswordController
};