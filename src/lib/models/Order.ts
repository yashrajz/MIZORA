import mongoose, { Schema, Document, Model } from 'mongoose';
import { IOrder, IOrderItem, IShippingAddress, OrderStatus } from '@/types';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        image: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
        },
        phone: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        items: {
            type: [OrderItemSchema],
            required: [true, 'Order items are required'],
            validate: {
                validator: function (items: IOrderItem[]) {
                    return items.length > 0;
                },
                message: 'Order must have at least one item',
            },
        },
        total: {
            type: Number,
            required: [true, 'Total is required'],
            min: [0, 'Total cannot be negative'],
        },
        shippingAddress: {
            type: ShippingAddressSchema,
            required: [true, 'Shipping address is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            default: 'card',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        stripeSessionId: {
            type: String,
            default: '',
        },
        stripePaymentIntentId: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order: Model<IOrderDocument> =
    mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
