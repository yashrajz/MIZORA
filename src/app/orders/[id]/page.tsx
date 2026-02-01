'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from 'lucide-react';
import styles from './order-details.module.css';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    shippingAddress: ShippingAddress;
}

const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444',
};

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const orderId = params.id as string;

    useEffect(() => {
        if (user && orderId) {
            fetchOrder();
        } else if (!user) {
            router.push('/signin');
        }
    }, [user, orderId]);

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json();

            if (data.success) {
                setOrder(data.data.order);
            } else {
                setError(data.error || 'Failed to load order');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <Loader2 size={32} className={styles.spinner} />
                        <p>Loading order details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Order Not Found</h2>
                        <p>{error || 'This order does not exist or you do not have permission to view it.'}</p>
                        <Link href="/orders" className={styles.backButton}>
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/orders" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Back to Orders
                </Link>

                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>
                            Order #{order._id?.slice(-8)?.toUpperCase() || 'N/A'}
                        </h1>
                        <p className={styles.date}>Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <span
                        className={styles.status}
                        style={{ backgroundColor: statusColors[order.status] || '#6b7280' }}
                    >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>

                <div className={styles.content}>
                    {/* Order Items */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Package size={20} />
                            Order Items
                        </h2>
                        <div className={styles.items}>
                            {order.items.map((item, index) => (
                                <div key={index} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className={styles.image}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemQuantity}>Quantity: {item.quantity}</span>
                                        <span className={styles.itemPrice}>
                                            ₹{item.price.toFixed(2)} each
                                        </span>
                                    </div>
                                    <div className={styles.itemTotal}>
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.orderTotal}>
                            <span>Total Amount</span>
                            <span className={styles.totalAmount}>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        {/* Shipping Address */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <MapPin size={20} />
                                Shipping Address
                            </h2>
                            <div className={styles.address}>
                                <p className={styles.addressName}>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.postalCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && (
                                    <p className={styles.phone}>Phone: {order.shippingAddress.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <CreditCard size={20} />
                                Payment Information
                            </h2>
                            <div className={styles.payment}>
                                <div className={styles.paymentRow}>
                                    <span>Payment Status</span>
                                    <span
                                        className={styles.paymentStatus}
                                        style={{
                                            color:
                                                order.paymentStatus === 'paid'
                                                    ? '#10b981'
                                                    : order.paymentStatus === 'failed'
                                                    ? '#ef4444'
                                                    : '#f59e0b',
                                        }}
                                    >
                                        {order.paymentStatus.charAt(0).toUpperCase() +
                                            order.paymentStatus.slice(1)}
                                    </span>
                                </div>
                                <div className={styles.paymentRow}>
                                    <span>Payment Method</span>
                                    <span>Card</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
