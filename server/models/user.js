import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase:true,
            trim: true
        },
        password : {
            type: String,
            minlength: 6
        },
        googleId: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default:'user'
        }
    },
    { timestamps: true}
);

userSchema.pre('save', async function (){
    if(!this.isModified('password') || !this.password) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword){
    if(!this.password) return false;
    return bcrypt.compare(enteredPassword,this.password);
};

const User = mongoose.model('User',userSchema);

export default User;