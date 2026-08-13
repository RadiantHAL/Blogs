import mongoose from "mongoose";
const tokenBlackListsSchema = new mongoose.Schema({
        token: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    },
    {
        timestamps: true
    })
export default mongoose.model('blacklist',tokenBlackListsSchema)