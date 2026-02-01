'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import styles from '../../app/products/pdp_layout.module.css';
import { Star, Heart, Truck, CreditCard, Headphones, Facebook, Twitter, Instagram, Loader2, Check } from 'lucide-react';

interface ProductDetailClientProps {
    product: Product;
}

// Size pricing multipliers
const SIZE_MULTIPLIERS: Record<string, number> = {
    '30g': 1,
    '100g': 2.5,
    '200g': 4.5,
    '250g': 5.5,
    '500g': 8.5,
    'N/A': 1,
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart, isLoading: cartLoading } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();
    
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'review'>('info');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    
    const inWishlist = isInWishlist(product.id);
    
    // Calculate available sizes based on product type
    const availableSizes = useMemo(() => {
        if (product.grade === 'Accessory') {
            return [product.weight];
        }
        return ['30g', '100g', '200g', '500g'];
    }, [product.grade, product.weight]);

    // Set default size to smallest available
    const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

    // Calculate current price based on selected size and quantity
    const currentPrice = useMemo(() => {
        const basePrice = product.price;
        const sizeMultiplier = SIZE_MULTIPLIERS[selectedSize] || SIZE_MULTIPLIERS[product.weight] || 1;
        const baseSizeMultiplier = SIZE_MULTIPLIERS[product.weight] || 1;
        const adjustedPrice = (basePrice / baseSizeMultiplier) * sizeMultiplier;
        return adjustedPrice;
    }, [product.price, product.weight, selectedSize]);

    const totalPrice = useMemo(() => {
        return currentPrice * quantity;
    }, [currentPrice, quantity]);

    // Get related products (same grade or category, excluding current product)
    const relatedProducts = useMemo(() => {
        return products
            .filter(p => p.id !== product.id && (p.grade === product.grade || p.bestFor.some(bf => product.bestFor.includes(bf))))
            .slice(0, 4);
    }, [product]);

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        setAddingToCart(true);
        const success = await addToCart(product.id, quantity, selectedSize);
        setAddingToCart(false);
        
        if (success) {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        setAddingToCart(true);
        const success = await addToCart(product.id, quantity, selectedSize);
        setAddingToCart(false);
        
        if (success) {
            router.push('/cart');
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        if (inWishlist) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbs}>
                <Link href="/">Home</Link> / <Link href="/#products">Shop</Link> / <span>Product Details</span>
            </div>

            <div className={styles.productGrid}>
                {/* Left: Gallery */}
                <div className={styles.gallerySection}>
                    <div className={styles.mainImageWrapper}>
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'contain', padding: '2rem' }}
                            priority
                        />
                    </div>
                    <div className={styles.thumbnails}>
                        {product.images?.map((img, i) => (
                            <div
                                key={i}
                                className={`${styles.thumb} ${selectedImage === img ? styles.active : ''}`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${i + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                        {/* Placeholder thumbnails to fill grid if needed */}
                    </div>
                </div>

                {/* Right: Info */}
                <div className={styles.infoSection}>
                    <div className={styles.categoryTag}>Matcha Tea</div>
                    <h1 className={styles.productTitle}>{product.name || 'Product'}</h1>

                    <div className={styles.ratingRow}>
                        <div style={{ display: 'flex', color: '#FFD700' }}>
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.rating || 0) ? "#FFD700" : "none"} />)}
                        </div>
                        <span>{product.rating || 0} ({product.reviews || 0} Reviews)</span>
                        <span style={{ color: '#0f0', background: '#0f02', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>In Stock</span>
                    </div>

                    <div className={styles.priceRow}>
                        <span className={styles.currentPrice}>₹{currentPrice.toFixed(2)}</span>
                        <span className={styles.originalPrice}>₹{(currentPrice * 1.2).toFixed(2)}</span>
                        {quantity > 1 && (
                            <span style={{ marginLeft: '1rem', color: '#C5A669', fontSize: '0.9rem' }}>
                                Total: ₹{totalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <p className={styles.description}>
                        {product.description || 'No description available.'}
                    </p>

                    {/* Size Selector */}
                    {product.grade !== 'Accessory' && (
                        <div className={styles.selectorRow}>
                            <span className={styles.selectorLabel}>Size/Volume</span>
                            <div className={styles.options}>
                                {availableSizes.map((size, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.optionBtn} ${selectedSize === size ? styles.active : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.actionRow}>
                        <div className={styles.qtyWrapper}>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(99, q + 1))} disabled={quantity >= 99}>+</button>
                        </div>
                        <button 
                            className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart || cartLoading}
                        >
                            {addingToCart ? (
                                <Loader2 size={18} className={styles.spinner} />
                            ) : addedToCart ? (
                                <>
                                    <Check size={18} />
                                    Added!
                                </>
                            ) : (
                                'Add To Cart'
                            )}
                        </button>
                        <button 
                            className={styles.buyNowBtn}
                            onClick={handleBuyNow}
                            disabled={addingToCart || cartLoading}
                        >
                            Buy Now
                        </button>
                        <button 
                            className={`${styles.wishlistBtn} ${inWishlist ? styles.inWishlist : ''}`}
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    <div className={styles.metaInfo}>
                        <div><span className={styles.metaLabel}>SKU:</span> MIZ-{product.id.length >= 4 ? product.id : product.id.padStart(4, '0')}</div>
                        <div><span className={styles.metaLabel}>Category:</span> {product.grade}, Tea</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={styles.metaLabel}>Share:</span>
                            <Facebook size={16} /> <Twitter size={16} /> <Instagram size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsSection}>
                <div className={styles.tabList}>
                    <button className={`${styles.tabBtn} ${activeTab === 'desc' ? styles.active : ''}`} onClick={() => setActiveTab('desc')}>Description</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'info' ? styles.active : ''}`} onClick={() => setActiveTab('info')}>Additional Information</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'review' ? styles.active : ''}`} onClick={() => setActiveTab('review')}>Review</button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'info' && (
                        <table className={styles.specsTable}>
                            <tbody>
                                <tr>
                                    <td className={styles.labelCol}>Grade</td>
                                    <td>{product.grade}</td>
                                </tr>
                                <tr>
                                    <td className={styles.labelCol}>Origin</td>
                                    <td>{product.origin}</td>
                                </tr>
                                <tr>
                                    <td className={styles.labelCol}>Best For</td>
                                    <td>{product.bestFor.join(', ')}</td>
                                </tr>
                                <tr>
                                    <td className={styles.labelCol}>Harvest</td>
                                    <td>First Flush (Spring)</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    {activeTab === 'desc' && (
                        <div>
                            <p className={styles.description}>{product.description}</p>
                            <p style={{ marginTop: '1rem', color: '#888' }}>Experience the authentic taste of Japan with Mizora's premium selection. Carefully shaded for 20 days prior to harvest to boost chlorophyll and amino acid content.</p>
                        </div>
                    )}
                    {activeTab === 'review' && (
                        <div>
                            <p style={{ color: '#888' }}>No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className={styles.relatedSection}>
                    <h3 className={styles.sectionTitle}>Explore Related Products</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {relatedProducts.map((relatedProduct) => (
                        <Link 
                            key={relatedProduct.id} 
                            href={`/products/${relatedProduct.slug}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', paddingBottom: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                <div style={{ background: '#f5f5f5', height: '250px', position: 'relative' }}>
                                    <Image
                                        src={relatedProduct.images[0]}
                                        alt={relatedProduct.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                    {relatedProduct.rating >= 4.8 && (
                                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#C5A669', color: '#fff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                            Top Rated
                                        </span>
                                    )}
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{relatedProduct.grade}</div>
                                    <h4 style={{ color: '#0B1A12', margin: '0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>{relatedProduct.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', color: '#FFD700' }}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star 
                                                    key={s} 
                                                    size={12} 
                                                    fill={s <= Math.round(relatedProduct.rating) ? "#FFD700" : "none"}
                                                    color="#FFD700"
                                                />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>({relatedProduct.reviews})</span>
                                    </div>
                                    <div style={{ color: '#C5A669', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        ₹{relatedProduct.price.toFixed(2)}
                                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                                            ₹{(relatedProduct.price * 1.2).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            )}

            {/* Footer Features */}
            <div className={styles.featuresRow}>
                <div className={styles.featureItem}>
                    <Truck className={styles.featureIcon} />
                    <div className={styles.featureText}>
                        <h4>Free Shipping</h4>
                        <p>Free shipping for orders above ₹499</p>
                    </div>
                </div>
                <div className={styles.featureItem}>
                    <CreditCard className={styles.featureIcon} />
                    <div className={styles.featureText}>
                        <h4>Flexible Payment</h4>
                        <p>Multiple secure payment options</p>
                    </div>
                </div>
                <div className={styles.featureItem}>
                    <Headphones className={styles.featureIcon} />
                    <div className={styles.featureText}>
                        <h4>24x7 Support</h4>
                        <p>We support online all days</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
