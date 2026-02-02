import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import styles from './ProductCollection.module.css';

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
const getMinPrice = (basePrice: number, baseWeight: string): number => {
    const baseSizeMultiplier = SIZE_MULTIPLIERS[baseWeight] || 1;
    const minSizeMultiplier = SIZE_MULTIPLIERS['30g'];
    return (basePrice / baseSizeMultiplier) * minSizeMultiplier;
};

export default function ProductCollection() {
    // Get products by slug
    const culinaryProduct = products.find(p => p.slug === 'culinary-grade-matcha');
    const latteProduct = products.find(p => p.slug === 'premium-latte-blend');
    const ceremonialProduct = products.find(p => p.slug === 'ceremonial-grade-matcha');
    const whiskProduct = products.find(p => p.slug === 'bamboo-whisk');
    const bowlProduct = products.find(p => p.slug === 'matcha-bowl');
    const teapotProduct = products.find(p => p.slug === 'tea-pot');

    return (
        <section className={styles.section} id="products">
            <div className={`container`}>
                <h2 className={styles.headline}>Discover the World <br /> of Matcha</h2>

                <div className={styles.mainGrid}>
                    {/* Left Stack */}
                    <div className={styles.leftStack}>
                        {culinaryProduct && (
                            <Link href={`/products/${culinaryProduct.slug}`} className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div>
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <div className={styles.label}>Starting Grade</div>
                                            <h3 className={styles.productTitle}>{culinaryProduct.name}</h3>
                                        </div>
                                        <span className={styles.price}>
                                            ₹{getMinPrice(culinaryProduct.price, culinaryProduct.weight).toFixed(0)}
                                        </span>
                                    </div>
                                    <div className={styles.smallImage} style={{ position: 'relative', overflow: 'hidden', background: 'none' }}>
                                        <Image
                                            src={culinaryProduct.images[0]}
                                            alt={culinaryProduct.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        )}
                        {latteProduct && (
                            <Link href={`/products/${latteProduct.slug}`} className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div>
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <div className={styles.label}>Standard Daily</div>
                                            <h3 className={styles.productTitle}>{latteProduct.name}</h3>
                                        </div>
                                        <span className={styles.price}>
                                            ₹{getMinPrice(latteProduct.price, latteProduct.weight).toFixed(0)}
                                        </span>
                                    </div>
                                    <div className={styles.smallImage} style={{ position: 'relative', overflow: 'hidden', background: 'none' }}>
                                        <Image
                                            src={latteProduct.images[0]}
                                            alt={latteProduct.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Right Featured */}
                    {ceremonialProduct && (
                        <Link href={`/products/${ceremonialProduct.slug}`} className={styles.featuredCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.featuredContent}>
                                <div className={styles.label}>Best Seller</div>
                                <h3 className={styles.featuredTitle}>{ceremonialProduct.name}</h3>
                                <p className={styles.featuredDesc}>{ceremonialProduct.subtitle}</p>
                                <div className={styles.featuredPrice}>
                                    ₹{getMinPrice(ceremonialProduct.price, ceremonialProduct.weight).toFixed(0)}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400 }}> / 30g</span>
                                </div>
                            </div>
                            <div className={styles.featuredImage} style={{ position: 'relative', overflow: 'hidden' }}>
                                <Image
                                    src={ceremonialProduct.images[0]}
                                    alt={ceremonialProduct.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </Link>
                    )}
                </div>

                {/* Bottom Accessories */}
                <div className={styles.bottomRow}>
                    {whiskProduct && (
                        <Link href={`/products/${whiskProduct.slug}`} className={styles.accessoryCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                                <Image
                                    src={whiskProduct.images[0]}
                                    alt={whiskProduct.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <h4 className={styles.accTitle}>{whiskProduct.name}</h4>
                            <span className={styles.accPrice}>₹{whiskProduct.price.toFixed(0)}</span>
                        </Link>
                    )}
                    {bowlProduct && (
                        <Link href={`/products/${bowlProduct.slug}`} className={styles.accessoryCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                                <Image
                                    src={bowlProduct.images[0]}
                                    alt={bowlProduct.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <h4 className={styles.accTitle}>{bowlProduct.name}</h4>
                            <span className={styles.accPrice}>₹{bowlProduct.price.toFixed(0)}</span>
                        </Link>
                    )}
                    {teapotProduct && (
                        <Link href={`/products/${teapotProduct.slug}`} className={styles.accessoryCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                                <Image
                                    src={teapotProduct.images[0]}
                                    alt={teapotProduct.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <h4 className={styles.accTitle}>{teapotProduct.name}</h4>
                            <span className={styles.accPrice}>₹{teapotProduct.price.toFixed(0)}</span>
                        </Link>
                    )}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/products" className={styles.exploreBtn}>Explore All Products</Link>
                </div>

            </div>
        </section >
    );
}
