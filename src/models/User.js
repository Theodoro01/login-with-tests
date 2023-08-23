import  mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({

    _id: {
        type: String,
        default: () => uuidv4()
      },
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    },
    createAt:{
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model( "users", UserSchema )

export default User