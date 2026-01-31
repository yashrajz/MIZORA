import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from '@/types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const ProductSchema = new Schema<IProductDocument>(
    {
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        subtitle: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        images: {
            type: [String],
            default: [],
        },
        grade: {
            type: String,
            default: '',
        },
        origin: {
            type: String,
            default: '',
        },
        weight: {
            type: String,
            default: '',
        },
        bestFor: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },
        features: {
            type: [String],
            default: [],
        },
        ingredients: {
            type: String,
            default: '',
        },
        stock: {
            type: Number,
            default: 100,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for common queries
ProductSchema.index({ slug: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ grade: 1 });

const Product: Model<IProductDocument> =
    mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
