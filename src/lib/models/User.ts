import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
        },
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        avatarUrl: {
            type: String,
            default: null,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
            default: null,
        },
        emailVerificationExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
UserSchema.index({ email: 1 });

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.passwordHash;
    return user;
};

const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
