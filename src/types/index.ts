// User Types
export interface IUser {
    _id?: string;
    email: string;
    passwordHash: string;
    fullName: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserPublic {
    _id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    createdAt: Date;
}

// Product Types
export interface IProduct {
    _id?: string;
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    description: string;
    images: string[];
    grade: string;
    origin: string;
    weight: string;
    bestFor: string[];
    rating: number;
    reviews: number;
    features: string[];
    ingredients: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

// Cart Types
export interface ICartItem {
    _id?: string;
    userId: string;
    productId: string;
    quantity: number;
    selectedSize?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItemPopulated extends Omit<ICartItem, 'productId'> {
    productId: IProduct;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IShippingAddress {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface IOrder {
    _id?: string;
    userId: string;
    items: IOrderItem[];
    total: number;
    shippingAddress: IShippingAddress;
    status: OrderStatus;
    paymentMethod?: string;
    paymentStatus?: 'pending' | 'paid' | 'failed';
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Auth Types
export interface SignUpRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: IUserPublic;
    token?: string;
}

// Cart Request Types
export interface AddToCartRequest {
    productId: string;
    quantity: number;    selectedSize?: string;}

export interface UpdateCartRequest {
    productId: string;
    quantity: number;
}

// Order Request Types
export interface CreateOrderRequest {
    shippingAddress: IShippingAddress;
    paymentMethod?: string;
}

// JWT Payload
export interface JWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
