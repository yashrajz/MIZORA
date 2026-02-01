'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import styles from './cart.module.css';

// Size pricing multipliers
const SIZE_MULTIPLIERS: Record<string, number> = {
    '30g': 1,
    '100g': 2.5,
    '200g': 4.5,
    '250g': 5.5,
    '500g': 8.5,
    'N/A': 1,
    'Kit Box': 1,
};

// Helper to calculate actual price based on size
function calculateItemPrice(basePrice: number, baseWeight: string, selectedSize?: string): number {
    if (!selectedSize || selectedSize === baseWeight) {
        return basePrice;
    }
    
    const baseSizeMultiplier = SIZE_MULTIPLIERS[baseWeight] || 1;
    const selectedSizeMultiplier = SIZE_MULTIPLIERS[selectedSize] || 1;
    
    return (basePrice / baseSizeMultiplier) * selectedSizeMultiplier;
}

export default function CartPage() {
    const { cart, isLoading, error, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();

    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <ShoppingBag size={64} strokeWidth={1} className={styles.emptyIcon} />
                        <h1 className={styles.emptyTitle}>Sign in to view your cart</h1>
                        <p className={styles.emptyText}>
                            Please sign in to add items to your cart and checkout.
                        </p>
                        <Link href="/signin" className={styles.signInButton}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (isLoading && cart.items.length === 0) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading your cart...</div>
                </div>
            </main>
        );
    }

    if (cart.items.length === 0) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <ShoppingBag size={64} strokeWidth={1} className={styles.emptyIcon} />
                        <h1 className={styles.emptyTitle}>Your cart is empty</h1>
                        <p className={styles.emptyText}>
                            Discover our premium matcha collection and add your favorites.
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
                <h1 className={styles.title}>Your Cart</h1>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.cartLayout}>
                    <div className={styles.cartItems}>
                        {cart.items.map((item) => {
                            const actualPrice = calculateItemPrice(
                                item.product?.price || 0,
                                item.product?.weight || '30g',
                                item.selectedSize
                            );
                            const itemTotal = actualPrice * item.quantity;
                            
                            return (
                            <div key={item._id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    {item.product?.images?.[0] && (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product?.name || 'Product'}
                                            width={100}
                                            height={100}
                                            className={styles.image}
                                        />
                                    )}
                                </div>
                                <div className={styles.itemDetails}>
                                    {item.product?.slug ? (
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className={styles.itemName}
                                        >
                                            {item.product?.name || 'Unknown Product'}
                                        </Link>
                                    ) : (
                                        <span className={styles.itemName}>{item.product?.name || 'Unknown Product'}</span>
                                    )}
                                    {item.selectedSize && (
                                        <p className={styles.itemSize}>Size: {item.selectedSize}</p>
                                    )}
                                    <p className={styles.itemPrice}>
                                        ₹{actualPrice.toFixed(2)}
                                    </p>
                                </div>
                                <div className={styles.itemActions}>
                                    <div className={styles.quantityControl}>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                                            }
                                            className={styles.quantityButton}
                                            disabled={isLoading || item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.productId, Math.min(99, item.quantity + 1))
                                            }
                                            className={styles.quantityButton}
                                            disabled={isLoading || item.quantity >= 99}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className={styles.removeButton}
                                        disabled={isLoading}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className={styles.itemTotal}>
                                    ₹{itemTotal.toFixed(2)}
                                </div>
                            </div>
                        )})}
                    </div>

                    <div className={styles.cartSummary}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>
                        <div className={styles.summaryRow}>
                            <span>Subtotal ({cart.itemCount} items)</span>
                            <span>₹{cart.subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{cart.subtotal >= 499 ? 'Free' : '₹50'}</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>
                                ₹{(cart.subtotal + (cart.subtotal >= 499 ? 0 : 50)).toFixed(2)}
                            </span>
                        </div>
                        <Link href="/checkout" className={styles.checkoutButton}>
                            Proceed to Checkout
                        </Link>
                        <Link href="/products" className={styles.continueLink}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
