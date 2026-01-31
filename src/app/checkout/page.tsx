'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import styles from './checkout.module.css';

interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');
    
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: user?.fullName || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate
        const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'country'];
        for (const field of requiredFields) {
            if (!shippingAddress[field as keyof ShippingAddress]) {
                setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        try {
            setIsLoading(true);
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod: 'card',
                }),
            });
            const data = await res.json();

            if (data.success) {
                setOrderComplete(true);
                setOrderId(data.data._id);
                await clearCart();
            } else {
                setError(data.error || 'Failed to place order');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.authRequired}>
                        <h1>Sign in to checkout</h1>
                        <p>Please sign in to complete your purchase.</p>
                        <Link href="/signin" className={styles.signInButton}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.items.length === 0 && !orderComplete) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.authRequired}>
                        <h1>Your cart is empty</h1>
                        <p>Add some items to your cart before checkout.</p>
                        <Link href="/products" className={styles.signInButton}>
                            Shop Now
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (orderComplete) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.successState}>
                        <CheckCircle size={64} className={styles.successIcon} />
                        <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
                        <p className={styles.successText}>
                            Thank you for your order. Your order ID is:
                        </p>
                        <p className={styles.orderId}>{orderId}</p>
                        <p className={styles.successText}>
                            We&apos;ll send you an email confirmation shortly.
                        </p>
                        <div className={styles.successActions}>
                            <Link href="/orders" className={styles.viewOrdersButton}>
                                View Orders
                            </Link>
                            <Link href="/products" className={styles.continueButton}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const shipping = cart.subtotal >= 50 ? 0 : 5;
    const total = cart.subtotal + shipping;

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/cart" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Back to Cart
                </Link>

                <h1 className={styles.title}>Checkout</h1>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.checkoutLayout}>
                    <form onSubmit={handleSubmit} className={styles.shippingForm}>
                        <h2 className={styles.sectionTitle}>Shipping Address</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={shippingAddress.fullName}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label htmlFor="address">Street Address *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={shippingAddress.address}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="city">City *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="state">State/Province *</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={shippingAddress.state}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="postalCode">Postal Code *</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={shippingAddress.postalCode}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="country">Country *</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={shippingAddress.country}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                >
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Japan">Japan</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.placeOrderButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
                        </button>
                    </form>

                    <div className={styles.orderSummary}>
                        <h2 className={styles.sectionTitle}>Order Summary</h2>
                        <div className={styles.orderItems}>
                            {cart.items.map((item) => (
                                <div key={item._id} className={styles.orderItem}>
                                    <div className={styles.itemImage}>
                                        {item.product?.images[0] && (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product?.name || 'Product'}
                                                width={60}
                                                height={60}
                                            />
                                        )}
                                        <span className={styles.itemQuantity}>{item.quantity}</span>
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{item.product?.name}</span>
                                        <span className={styles.itemPrice}>
                                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>${cart.subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

