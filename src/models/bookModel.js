import mongoose from "../config/db.connect.js";


const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    service:{
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    message :{
        type: String,
        required: true
    },customService :{
        type: String,
       default: null
    },
    name:{
        type: String,
        required: true
    },phone:{
        type: String,
        required: true
    },address:{
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },

},{
    timestamps: true,
    versionKey: false
})


const Booking = mongoose.model("booking", bookingSchema)

export default Booking

