import mongoose, { Document, Schema } from 'mongoose';
import { BaseAttributes } from './model';

export interface UserModel extends BaseAttributes, Document {
    email: string;
    username: string;
    password: string;
    role: 'basic' | 'supervisor' | 'admin';
    language: string;
    elo: number;
}

const UserSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (email: string) => /\S+@\S+\.\S+/.test(email),
            message: 'Invalid email'
        },
        trim: true
    },
    username: {
        type: Schema.Types.String,
        required: [true, 'Username is required'],
        trim: true
    },
    password: {
        type: Schema.Types.String,
        required: [true, 'Password is required'],
        select: false
    },
    role: {
        type: Schema.Types.String,
        enum: ['basic', 'supervisor', 'admin'],
        default: 'basic'
    },
    language: {
        type: Schema.Types.String,
        enum: ['en', 'fr', 'de', 'es'],
        default: 'en'
    },
    elo: {
        type: Schema.Types.Number,
        default: 0
    }
}, {
    timestamps: true
});

const User = mongoose.model<UserModel>('user', UserSchema);

export default User;