import mongoose from "../config/db.connect.js";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, role: {
        type: String,
        default: "user"
    },area: {
        type: String,
        unique: true,
        default: null
    }
})



const User = mongoose.model("user", userSchema)
export default User