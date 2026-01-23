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
                        <div className={styles.productCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <div className={styles.label}>Starting Grade</div>
                                    <h3 className={styles.productTitle}>Culinary Grade</h3>
                                </div>
                                <span className={styles.price}>$18</span>
                            </div>
                            <div className={styles.smallImage} style={{ position: 'relative', overflow: 'hidden', background: 'none' }}>
                                <Image
                                    src="/images/product_culinary_small.png"
                                    alt="Culinary Grade Powder"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div className={styles.productCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <div className={styles.label}>Standard Daily</div>
                                    <h3 className={styles.productTitle}>Daily Usage</h3>
                                </div>
                                <span className={styles.price}>$24</span>
                            </div>
                            <div className={styles.smallImage} style={{ position: 'relative', overflow: 'hidden', background: 'none' }}>
                                <Image
                                    src="/images/product_daily_small.png"
                                    alt="Daily Usage Powder"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Featured */}
                    <div className={styles.featuredCard}>
                        <div className={styles.featuredContent}>
                            <div className={styles.label}>Best Seller</div>
                            <h3 className={styles.featuredTitle}>Ceremonial Grade Matcha</h3>
                            <p className={styles.featuredDesc}>The highest quality matcha, vibrant green and sweet.</p>
                            <div className={styles.featuredPrice}>$32 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ 30gr</span></div>
                        </div>
                        <div className={styles.featuredImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/product_ceremonial.png"
                                alt="Ceremonial Grade Matcha"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Accessories */}
                <div className={styles.bottomRow}>
                    <div className={styles.accessoryCard}>
                        <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/product_whisk.png"
                                alt="Bamboo Whisk"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 className={styles.accTitle}>Bamboo Whisk</h4>
                        <span className={styles.accPrice}>$15</span>
                    </div>
                    <div className={styles.accessoryCard}>
                        <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/hero_matcha_bowl.png"
                                alt="Matcha Bowl"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 className={styles.accTitle}>Matcha Bowl</h4>
                        <span className={styles.accPrice}>$35</span>
                    </div>
                    <div className={styles.accessoryCard}>
                        <div className={styles.accImage} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/product_teapot.png"
                                alt="Tea Pot"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 className={styles.accTitle}>Tea Pot</h4>
                        <span className={styles.accPrice}>$40</span>
                    </div>
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/products" className={styles.exploreBtn}>Example All Products</Link>
                </div>

            </div>
        </section>
    );
}
