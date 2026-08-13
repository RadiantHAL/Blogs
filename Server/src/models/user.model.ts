import mongoose  from "mongoose"



const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        minlength:[3,"Username must contain at least 3 characters"],
        maxlength: [150,"Username must be at most 150 characters"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must contain at least 8 characters"],
        maxlength: [128, "Password must be at most 128 characters"]
    }

},{
    timestamps: true
})

export default mongoose.model("user",userSchema)