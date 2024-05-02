import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    otp: {
        type:Number,
        required:true,
    }
},{timestamps:true,});

otpSchema.index({createdAt:1},{expireAfterSeconds:5*60});

const Otp = mongoose.model("Otp", otpSchema);


export default Otp;