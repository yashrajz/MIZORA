import { Leaf, Award, Smile } from 'lucide-react';
import Image from 'next/image';
import styles from './Benefits.module.css';

export default function Benefits() {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>

                <div className={styles.topSection}>
                    <div>
                        <h2 className={styles.headline}>Experience Wellness with Every Sip</h2>
                        <p className={styles.subhead}>
                            Matcha is more than just tea; it's a ritual of mindfulness, bringing focus and calm to your daily routine.
                        </p>
                    </div>
                    <div className={styles.imageGrid}>
                        <div className={styles.imageTile}>
                            <Image
                                src="/images/benefit_antioxidant.png"
                                alt="Anti Oxidant"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <span className={styles.tileLabel}>Anti Oxidant</span>
                        </div>
                        <div className={styles.imageTile}>
                            <Image
                                src="/images/benefit_wellness.png"
                                alt="Relax & Focus"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <span className={styles.tileLabel}>Relax & Focus</span>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <div className={styles.benefitCol}>
                        <div className={styles.iconCircle}>
                            <Leaf size={24} />
                        </div>
                        <h3 className={styles.benefitTitle}>Rich Flavor & <br /> Vibrant Color</h3>
                        <p className={styles.benefitText}>
                            Only the finest, youngest leaves are selected, ensuring a sweet, umami-rich flavor profile.
                        </p>
                    </div>

                    <div className={styles.benefitCol}>
                        <div className={styles.iconCircle}>
                            <Award size={24} />
                        </div>
                        <h3 className={styles.benefitTitle}>Authentic Japanese <br /> Matcha</h3>
                        <p className={styles.benefitText}>
                            Sourced directly from the prestigious Uji region, respecting centuries of tradition.
                        </p>
                    </div>

                    <div className={styles.benefitCol}>
                        <div className={styles.iconCircle}>
                            <Smile size={24} />
                        </div>
                        <h3 className={styles.benefitTitle}>Health & <br /> Sustainability</h3>
                        <p className={styles.benefitText}>
                            Packed with antioxidants and L-Theanine. Grown with respect for the earth.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
