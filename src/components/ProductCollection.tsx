import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCollection.module.css';

export default function ProductCollection() {
    return (
        <section className={styles.section} id="products">
            <div className={`container`}>
                <h2 className={styles.headline}>Discover the World <br /> of Matcha</h2>

                <div className={styles.mainGrid}>
                    {/* Left Stack */}
                    <div className={styles.leftStack}>
                        <Link href="/products/culinary-grade-matcha" className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <div className={styles.label}>Starting Grade</div>
                                        <h3 className={styles.productTitle}>Culinary Grade</h3>
                                    </div>
                                    <span className={styles.price}>₹499</span>
                                </div>
                                <div className={styles.smallImage} style={{ position: 'relative', overflow: 'hidden', background: 'none' }}>
                                    <Image
                                        src="/images/culinary_pouch_main.jpg"
                                        alt="Culinary Grade Powder"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </Link>
                        <Link href="/products/premium-latte-blend" className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <div className={styles.label}>Standard Daily</div>
                                        <h3 className={styles.productTitle}>Premium Latte Blend</h3>
                                    </div>
                                    <span className={styles.price}>₹699</span>
                                </div>
                                <div className={styles.smallImage} style={{ position: 'relative', overflow: 'hidden', background: 'none' }}>
                                    <Image
                                        src="/images/latte_pouch_new.png"
                                        alt="Premium Latte Blend"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right Featured */}
                    <Link href="/products/ceremonial-grade-matcha" className={styles.featuredCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.featuredContent}>
                            <div className={styles.label}>Best Seller</div>
                            <h3 className={styles.featuredTitle}>Ceremonial Grade Matcha</h3>
                            <p className={styles.featuredDesc}>The highest quality matcha, vibrant green and sweet.</p>
                            <div className={styles.featuredPrice}>₹999 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ 30gr</span></div>
                        </div>
                        <div className={styles.featuredImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/ceremonial_tin_new.jpg"
                                alt="Ceremonial Grade Matcha"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </Link>
                </div>

                {/* Bottom Accessories */}
                {/* Bottom Accessories */}
                <div className={styles.bottomRow}>
                    <Link href="/products/bamboo-whisk" className={styles.accessoryCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/product_whisk.png"
                                alt="Bamboo Whisk"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 className={styles.accTitle}>Bamboo Whisk</h4>
                        <span className={styles.accPrice}>₹399</span>
                    </Link>
                    <Link href="/products/matcha-bowl" className={styles.accessoryCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/acc_bowl_zen.jpg"
                                alt="Matcha Bowl"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 className={styles.accTitle}>Matcha Bowl</h4>
                        <span className={styles.accPrice}>₹899</span>
                    </Link>
                    <Link href="/products/tea-pot" className={styles.accessoryCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/product_teapot.png"
                                alt="Tea Pot"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 className={styles.accTitle}>Tea Pot</h4>
                        <span className={styles.accPrice}>₹1099</span>
                    </Link>
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/products" className={styles.exploreBtn}>Explore All Products</Link>
                </div>

            </div>
        </section >
    );
}
