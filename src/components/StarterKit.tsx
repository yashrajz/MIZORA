import styles from './StarterKit.module.css';
import Image from 'next/image';

export default function StarterKit() {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>

                <div className={styles.imageArea}>
                    {/* Placeholder for complex image composition */}
                    <div className={styles.mainImage} style={{ position: 'relative', height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
                        <Image
                            src="/images/starter_kit_combo.png"
                            alt="Matcha Starter Kit"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div className={styles.content}>
                    <span className={styles.label}>Get Started Today</span>
                    <h2 className={styles.headline}>Matcha <br /> Starter Kits</h2>

                    <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>Get it for</span>
                        <span className={styles.price}>₹699</span>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <div className={styles.bullet} />
                            <div>
                                <strong>Bamboo Whisk (Chasen)</strong>
                                <div className={styles.featureDesc}>Handcrafted for the perfect froth.</div>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.bullet} />
                            <div>
                                <strong>Matcha Bowl (Chawan)</strong>
                                <div className={styles.featureDesc}>Wide-bottomed tailored for whisking.</div>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.bullet} />
                            <div>
                                <strong>Premium Powder</strong>
                                <div className={styles.featureDesc}>30g of Ceremonial Grade Matcha.</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
