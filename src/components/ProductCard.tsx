'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, Loader2, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/data/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
}

// Size pricing multipliers (same as in ProductDetailClient)
const SIZE_MULTIPLIERS: Record<string, number> = {
    '30g': 1,
    '100g': 2.5,
    '200g': 4.5,
    '250g': 5.5,
    '500g': 8.5,
    'N/A': 1,
};

// Calculate minimum price (30g equivalent) for a product
const getMinPrice = (basePrice: number, baseWeight: string, grade: string): number => {
    // Accessories don't have size variants, return base price
    if (grade === 'Accessory' || baseWeight === 'N/A' || baseWeight === 'Kit Box') {
        return basePrice;
    }

    const baseSizeMultiplier = SIZE_MULTIPLIERS[baseWeight] || 1;
    const minSizeMultiplier = SIZE_MULTIPLIERS['30g'];
    return (basePrice / baseSizeMultiplier) * minSizeMultiplier;
};

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const inWishlist = isInWishlist(product.id);

    // Calculate display price
    const displayPrice = useMemo(() => {
        return getMinPrice(product.price, product.weight, product.grade);
    }, [product.price, product.weight, product.grade]);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/signin');
            return;
        }

        setAdding(true);
        const success = await addToCart(product.id, 1);
        setAdding(false);

        if (success) {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/signin');
            return;
        }

        setWishlistLoading(true);
        if (inWishlist) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
        setWishlistLoading(false);
    };

    return (
        <div className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.link}>
                <div className={styles.imageWrapper}>
                    {product.images?.[0] && (
                        <Image
                            src={product.images[0]}
                            alt={product.name || 'Product'}
                            fill
                            className={styles.image}
                        />
                    )}
                    <button
                        className={`${styles.wishlistBtn} ${inWishlist ? styles.inWishlist : ''}`}
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className={`${styles.quickAdd} ${added ? styles.added : ''}`}
                        onClick={handleAddToCart}
                        disabled={adding}
                        aria-label="Add to cart"
                    >
                        {adding ? (
                            <Loader2 size={18} className={styles.spinner} />
                        ) : added ? (
                            <Check size={18} />
                        ) : (
                            <ShoppingCart size={18} />
                        )}
                    </button>
                </div>
                <div className={styles.content}>
                    <div className={styles.meta}>
                        <span className={styles.grade}>{product.grade}</span>
                        <span className={styles.price}>₹{displayPrice.toFixed(0)}</span>
                    </div>
                    <h2 className={styles.name}>{product.name}</h2>
                    <p className={styles.subtitle}>{product.subtitle}</p>
                </div>
            </Link>
        </div>
    );
}
