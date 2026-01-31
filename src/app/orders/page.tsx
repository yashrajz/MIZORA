'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Package, ChevronRight, Clock } from 'lucide-react';
import styles from './orders.module.css';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
    shippingAddress: {
        fullName: string;
        city: string;
        country: string;
    };
}

const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444',
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/orders');
            const data = await res.json();

            if (data.success) {
                setOrders(data.data.orders);
            } else {
                setError(data.error || 'Failed to load orders');
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
        });
    };

    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <Package size={64} strokeWidth={1} className={styles.emptyIcon} />
                        <h1 className={styles.emptyTitle}>Sign in to view orders</h1>
                        <p className={styles.emptyText}>
                            Please sign in to see your order history.
                        </p>
                        <Link href="/signin" className={styles.signInButton}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading your orders...</div>
                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <Package size={64} strokeWidth={1} className={styles.emptyIcon} />
                        <h1 className={styles.emptyTitle}>No orders yet</h1>
                        <p className={styles.emptyText}>
                            Start shopping to see your orders here.
                        </p>
                        <Link href="/products" className={styles.shopButton}>
                            Shop Now
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Your Orders</h1>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order._id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                    <span className={styles.orderId}>
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </span>
                                    <span className={styles.orderDate}>
                                        <Clock size={14} />
                                        {formatDate(order.createdAt)}
                                    </span>
                                </div>
                                <span
                                    className={styles.orderStatus}
                                    style={{ backgroundColor: statusColors[order.status] || '#6b7280' }}
                                >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className={styles.orderItems}>
                                {order.items.slice(0, 3).map((item, index) => (
                                    <div key={index} className={styles.orderItem}>
                                        <span className={styles.itemName}>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className={styles.itemPrice}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <span className={styles.moreItems}>
                                        +{order.items.length - 3} more items
                                    </span>
                                )}
                            </div>

                            <div className={styles.orderFooter}>
                                <div className={styles.orderTotal}>
                                    <span>Total:</span>
                                    <span className={styles.totalAmount}>
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>
                                <Link href={`/orders/${order._id}`} className={styles.viewDetails}>
                                    View Details
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
