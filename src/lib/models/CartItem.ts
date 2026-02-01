import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICartItem } from '@/types';

export interface ICartItemDocument extends Omit<ICartItem, '_id'>, Document {}

const CartItemSchema = new Schema<ICartItemDocument>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        productId: {
            type: String,
            required: [true, 'Product ID is required'],
            ref: 'Product',
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
            default: 1,
        },
        selectedSize: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique user-product-size combination
CartItemSchema.index({ userId: 1, productId: 1, selectedSize: 1 }, { unique: true });

const CartItem: Model<ICartItemDocument> =
    mongoose.models.CartItem || mongoose.model<ICartItemDocument>('CartItem', CartItemSchema);

export default CartItem;
