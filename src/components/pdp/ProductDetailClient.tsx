'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import styles from '../../app/products/pdp_layout.module.css';
import { Star, Heart, Truck, CreditCard, Headphones, Share2, Facebook, Twitter, Instagram } from 'lucide-react';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'review'>('info');
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product.weight); // Default to product weight

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
                        {product.images.map((img, i) => (
                            <div
                                key={i}
                                className={`${styles.thumb} ${selectedImage === img ? styles.active : ''}`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${i}`}
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
                    <h1 className={styles.productTitle}>{product.name}</h1>

                    <div className={styles.ratingRow}>
                        <div style={{ display: 'flex', color: '#FFD700' }}>
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.rating) ? "#FFD700" : "none"} />)}
                        </div>
                        <span>{product.rating} ({product.reviews} Reviews)</span>
                        <span style={{ color: '#0f0', background: '#0f02', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>In Stock</span>
                    </div>

                    <div className={styles.priceRow}>
                        <span className={styles.currentPrice}>${product.price.toFixed(2)}</span>
                        <span className={styles.originalPrice}>${(product.price * 1.2).toFixed(2)}</span>
                    </div>

                    <p className={styles.description}>
                        {product.description}
                    </p>

                    {/* Size Selector */}
                    <div className={styles.selectorRow}>
                        <span className={styles.selectorLabel}>Size/Volume</span>
                        <div className={styles.options}>
                            {[product.weight, '200g', '500g'].map((size, i) => (
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

                    {/* Actions */}
                    <div className={styles.actionRow}>
                        <div className={styles.qtyWrapper}>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <button className={styles.addToCartBtn}>Add To Cart</button>
                        <button className={styles.buyNowBtn}>Buy Now</button>
                        <button className={styles.wishlistBtn}><Heart size={20} /></button>
                    </div>

                    <div className={styles.metaInfo}>
                        <div><span className={styles.metaLabel}>SKU:</span> MIZ-{product.id.padStart(4, '0')}</div>
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

            {/* Related Products Placeholder */}
            <div className={styles.relatedSection}>
                <h3 className={styles.sectionTitle}>Explore Related Products</h3>
                {/* Reusing ProductCollection grid logic would go here, simpler version for now */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {/* Mock Cards */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', paddingBottom: '1rem' }}>
                            <div style={{ background: '#eee', height: '250px', position: 'relative' }}>
                                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#0d2e1c', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>50% off</span>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Skin Care</div>
                                <h4 style={{ color: '#000', margin: '0.5rem 0' }}>Related Item {i}</h4>
                                <div style={{ color: '#C5A669', fontWeight: 'bold' }}>$35.00 <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em', fontWeight: 'normal' }}>$70.00</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Features */}
            <div className={styles.featuresRow}>
                <div className={styles.featureItem}>
                    <Truck className={styles.featureIcon} />
                    <div className={styles.featureText}>
                        <h4>Free Shipping</h4>
                        <p>Free shipping for orders above $50</p>
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
