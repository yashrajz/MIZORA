import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlistItem {
    _id?: string;
    userId: string;
    productId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IWishlistItemDocument extends Omit<IWishlistItem, '_id'>, Document {}

const WishlistItemSchema = new Schema<IWishlistItemDocument>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        productId: {
            type: String,
            required: [true, 'Product ID is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique user-product combination
WishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const WishlistItem: Model<IWishlistItemDocument> =
    mongoose.models.WishlistItem || mongoose.model<IWishlistItemDocument>('WishlistItem', WishlistItemSchema);

export default WishlistItem;
