'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
    User, 
    Package, 
    ShoppingBag, 
    Settings, 
    LogOut, 
    ChevronRight,
    Mail,
    Calendar,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import styles from './dashboard.module.css';

interface Order {
    _id: string;
    status: string;
    paymentStatus: string;
    total: number;
    createdAt: string;
    items: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    shippingAddress?: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/signin');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                if (data.success && data.data?.orders && Array.isArray(data.data.orders)) {
                    setOrders(data.data.orders);
                } else if (data.success && Array.isArray(data.data)) {
                    setOrders(data.data);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (isLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.loading}>Loading...</div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return styles.statusDelivered;
            case 'shipped': return styles.statusShipped;
            case 'processing': return styles.statusProcessing;
            case 'cancelled': return styles.statusCancelled;
            default: return styles.statusPending;
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.profileCard}>
                        <div className={styles.avatar}>
                            {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <h2 className={styles.userName}>{user.fullName || 'User'}</h2>
                        <p className={styles.userEmail}>{user.email}</p>
                        {user.isEmailVerified ? (
                            <span className={styles.verifiedBadge}>
                                <CheckCircle size={14} /> Verified
                            </span>
                        ) : (
                            <span className={styles.unverifiedBadge}>
                                <AlertCircle size={14} /> Not Verified
                            </span>
                        )}
                    </div>

                    <nav className={styles.nav}>
                        <button 
                            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <User size={20} />
                            Overview
                        </button>
                        <button 
                            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Package size={20} />
                            My Orders
                            {orders.length > 0 && (
                                <span className={styles.badge}>{orders.length}</span>
                            )}
                        </button>
                        <button 
                            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={20} />
                            Settings
                        </button>
                    </nav>

                    <button className={styles.signOutButton} onClick={handleSignOut}>
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </aside>

                {/* Main Content */}
                <div className={styles.content}>
                    {activeTab === 'overview' && (
                        <div className={styles.overview}>
                            <h1 className={styles.pageTitle}>Welcome back, {user.fullName?.split(' ')[0] || 'User'}!</h1>
                            
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <Package size={24} />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>{orders.length}</span>
                                        <span className={styles.statLabel}>Total Orders</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>
                                            {orders.filter(o => o.status.toLowerCase() === 'delivered').length}
                                        </span>
                                        <span className={styles.statLabel}>Delivered</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <Mail size={24} />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>
                                            {user.isEmailVerified ? 'Yes' : 'No'}
                                        </span>
                                        <span className={styles.statLabel}>Email Verified</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <Calendar size={24} />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statValue}>
                                            {formatDate(user.createdAt.toString())}
                                        </span>
                                        <span className={styles.statLabel}>Member Since</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Recent Orders</h2>
                                    {orders.length > 0 && (
                                        <button 
                                            className={styles.viewAllButton}
                                            onClick={() => setActiveTab('orders')}
                                        >
                                            View All <ChevronRight size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                {loadingOrders ? (
                                    <p className={styles.emptyText}>Loading orders...</p>
                                ) : orders.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <Package size={48} className={styles.emptyIcon} />
                                        <p>No orders yet</p>
                                        <Link href="/products" className={styles.shopButton}>
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div className={styles.ordersList}>
                                        {orders.slice(0, 3).map((order) => (
                                            <div key={order._id} className={styles.orderCard}>
                                                <div className={styles.orderHeader}>
                                                    <span className={styles.orderNumber}>#{order._id?.slice(-8)?.toUpperCase() || 'N/A'}</span>
                                                    <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className={styles.orderDetails}>
                                                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                                                    <span className={styles.orderTotal}>₹{(order.total || 0).toFixed(2)}</span>
                                                </div>
                                                <div className={styles.orderItems}>
                                                    {order.items.slice(0, 2).map((item, idx) => (
                                                        <span key={idx} className={styles.orderItem}>
                                                            {item.name} × {item.quantity}
                                                        </span>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <span className={styles.moreItems}>
                                                            +{order.items.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className={styles.ordersTab}>
                            <h1 className={styles.pageTitle}>My Orders</h1>
                            
                            {loadingOrders ? (
                                <p className={styles.emptyText}>Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Package size={48} className={styles.emptyIcon} />
                                    <p>You haven&apos;t placed any orders yet</p>
                                    <Link href="/products" className={styles.shopButton}>
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.ordersList}>
                                    {orders.map((order) => (
                                        <div key={order._id} className={styles.orderCard}>
                                            <div className={styles.orderHeader}>
                                                <span className={styles.orderNumber}>Order #{order._id?.slice(-8)?.toUpperCase() || 'N/A'}</span>
                                                <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className={styles.orderDetails}>
                                                <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                                                <span className={styles.orderTotal}>₹{(order.total || 0).toFixed(2)}</span>
                                            </div>
                                            <div className={styles.orderItemsList}>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className={styles.orderItemRow}>
                                                        <span>{item.name}</span>
                                                        <span>× {item.quantity}</span>
                                                        <span>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className={styles.settingsTab}>
                            <h1 className={styles.pageTitle}>Account Settings</h1>
                            
                            <div className={styles.settingsSection}>
                                <h3 className={styles.settingsSectionTitle}>Profile Information</h3>
                                <div className={styles.settingsForm}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Full Name</label>
                                        <input 
                                            type="text" 
                                            className={styles.input} 
                                            value={user.fullName}
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email Address</label>
                                        <input 
                                            type="email" 
                                            className={styles.input} 
                                            value={user.email}
                                            disabled
                                        />
                                    </div>
                                    <p className={styles.settingsNote}>
                                        Contact support to update your profile information.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.settingsSection}>
                                <h3 className={styles.settingsSectionTitle}>Email Verification</h3>
                                {user.isEmailVerified ? (
                                    <div className={styles.verifiedStatus}>
                                        <CheckCircle size={20} />
                                        <span>Your email is verified</span>
                                    </div>
                                ) : (
                                    <div className={styles.unverifiedStatus}>
                                        <AlertCircle size={20} />
                                        <span>Your email is not verified</span>
                                        <button className={styles.resendButton}>
                                            Resend Verification Email
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.settingsSection}>
                                <h3 className={styles.settingsSectionTitle}>Danger Zone</h3>
                                <button className={styles.dangerButton} onClick={handleSignOut}>
                                    Sign Out of All Devices
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
