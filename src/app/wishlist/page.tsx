'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import styles from './wishlist.module.css';
import { useState } from 'react';

export default function WishlistPage() {
    const router = useRouter();
    const { wishlist, isLoading, error, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const handleAddToCart = async (productId: string) => {
        setAddingToCart(productId);
        const success = await addToCart(productId, 1);
        setAddingToCart(null);
        
        if (success) {
            // Optionally remove from wishlist after adding to cart
            // await removeFromWishlist(productId);
        }
    };

    const handleRemove = async (productId: string) => {
        await removeFromWishlist(productId);
    };

    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <Heart size={64} strokeWidth={1} className={styles.emptyIcon} />
                        <h1 className={styles.emptyTitle}>Sign in to view your wishlist</h1>
                        <p className={styles.emptyText}>
                            Please sign in to save items to your wishlist.
                        </p>
                        <Link href="/signin" className={styles.signInButton}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (isLoading && wishlist.items.length === 0) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading your wishlist...</div>
                </div>
            </main>
        );
    }

    if (wishlist.items.length === 0) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <Heart size={64} strokeWidth={1} className={styles.emptyIcon} />
                        <h1 className={styles.emptyTitle}>Your wishlist is empty</h1>
                        <p className={styles.emptyText}>
                            Save your favorite matcha products to your wishlist and come back to them later.
                        </p>
                        <Link href="/products" className={styles.shopButton}>
                            Explore Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Wishlist</h1>
                    <span className={styles.count}>{wishlist.itemCount} {wishlist.itemCount === 1 ? 'item' : 'items'}</span>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.wishlistGrid}>
                    {wishlist.items.map((item) => (
                        <div key={item._id} className={styles.wishlistItem}>
                            {item.product?.slug ? (
                                <Link href={`/products/${item.product.slug}`} className={styles.imageLink}>
                                    <div className={styles.imageWrapper}>
                                        {item.product?.images?.[0] && (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product?.name || 'Product'}
                                                fill
                                                className={styles.image}
                                            />
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <div className={styles.imageWrapper}>
                                    {item.product?.images?.[0] && (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product?.name || 'Product'}
                                            fill
                                            className={styles.image}
                                        />
                                    )}
                                </div>
                            )}
                            <div className={styles.itemContent}>
                                <span className={styles.grade}>{item.product?.grade}</span>
                                <Link
                                    href={`/products/${item.product?.slug}`}
                                    className={styles.itemName}
                                >
                                    {item.product?.name}
                                </Link>
                                <p className={styles.subtitle}>{item.product?.subtitle}</p>
                                <div className={styles.itemActions}>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemove(item.productId)}
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
