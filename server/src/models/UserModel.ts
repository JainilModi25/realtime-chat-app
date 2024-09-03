import mongoose from 'mongoose';
import {genSalt, hash} from 'bcrypt'


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: false,
      }
});



userSchema.pre("save", async function(next){
    // Check if the password field has been modified
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await genSalt();     //generate salt
    this.password = await hash(this.password, salt);     //modify the current non-hashed password by the hashed one
    next();
})

const User = mongoose.model("Users", userSchema);
export default User;