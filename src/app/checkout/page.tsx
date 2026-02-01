'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Loader2 } from 'lucide-react';
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
    const { cart } = useCart();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: user?.fullName || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Sanitize input by trimming and limiting length
        const sanitizedValue = value.slice(0, 200).trim();
        setShippingAddress(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate
        const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'country'];
        for (const field of requiredFields) {
            if (!shippingAddress[field as keyof ShippingAddress]?.trim()) {
                setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        // Validate postal code format (basic)
        if (!/^[A-Za-z0-9\s-]{3,10}$/.test(shippingAddress.postalCode)) {
            setError('Please enter a valid postal code');
            return;
        }

        // Validate phone number if provided
        if (shippingAddress.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(shippingAddress.phone)) {
            setError('Please enter a valid phone number');
            return;
        }

        try {
            setIsLoading(true);
            
            // Create Stripe checkout session
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress,
                }),
            });
            const data = await res.json();

            if (data.success) {
                // Redirect to Stripe Checkout using the session URL
                if (data.data.sessionUrl) {
                    window.location.href = data.data.sessionUrl;
                } else {
                    setError('Failed to get checkout URL');
                }
            } else {
                setError(data.error || 'Failed to create checkout session');
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

    if (cart.items.length === 0) {
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

    const shipping = cart.subtotal >= 3000 ? 0 : 299;
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
                                    <option value="India">India</option>
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Japan">Japan</option>
                                </select>
                            </div>
                        </div>

                        {/* Payment Info Section */}
                        <div className={styles.paymentSection}>
                            <h2 className={styles.sectionTitle}>
                                <CreditCard size={20} />
                                Payment
                            </h2>
                            <div className={styles.stripeInfo}>
                                <div className={styles.stripeCard}>
                                    <ShieldCheck size={24} className={styles.secureIcon} />
                                    <div>
                                        <p className={styles.secureText}>Secure Payment via Stripe</p>
                                        <p className={styles.secureSubtext}>
                                            Your payment information is encrypted and secure. You&apos;ll be redirected to Stripe to complete your purchase.
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.paymentMethods}>
                                    <span>Accepted:</span>
                                    <div className={styles.cardIcons}>
                                        <span className={styles.cardBrand}>Visa</span>
                                        <span className={styles.cardBrand}>Mastercard</span>
                                        <span className={styles.cardBrand}>Amex</span>
                                        <span className={styles.cardBrand}>Discover</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.placeOrderButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className={styles.spinner} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Pay ₹{total.toFixed(2)}
                                </>
                            )}
                        </button>
                        
                        <p className={styles.securityNote}>
                            <Lock size={14} />
                            256-bit SSL encrypted checkout
                        </p>
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
                                            ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₹{cart.subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                        </div>
                        {shipping === 0 && (
                            <div className={styles.freeShippingNote}>
                                🎉 You qualify for free shipping!
                            </div>
                        )}
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

