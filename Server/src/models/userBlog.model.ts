import mongoose from "mongoose"
const userBlog = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    }],
    favoriteTags:[{
        type:String,
        trim:true
    }]
})

export default mongoose.model('userblog',userBlog)