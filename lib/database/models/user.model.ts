import mongoose, { model, models } from "mongoose";

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required:true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
    },
    photo:{
        type: String,
    }

})

const User = models.User || model('User', UserSchema);
export default User;