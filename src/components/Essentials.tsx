import styles from './Essentials.module.css';
import Image from 'next/image';

export default function Essentials() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.headline}>Matcha Pairing Essentials</h2>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.imageArea} style={{ position: 'relative' }}>
                            <Image
                                src="/images/essential_latte.png"
                                alt="Matcha Latte Mix"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <div>
                                <h3 className={styles.cardTitle}>Matcha Latte Mix</h3>
                                <p className={styles.cardDesc}>Pre-sweetened with monk fruit for a healthy treat.</p>
                            </div>
                            <span className={styles.priceBadge}>$28</span>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.imageArea} style={{ position: 'relative' }}>
                            <Image
                                src="/images/essential_cake.png"
                                alt="Matcha Cake Powder"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <div>
                                <h3 className={styles.cardTitle}>Matcha Cake Powder</h3>
                                <p className={styles.cardDesc}>Culinary grade specifically for baking and desserts.</p>
                            </div>
                            <span className={styles.priceBadge}>$22</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
