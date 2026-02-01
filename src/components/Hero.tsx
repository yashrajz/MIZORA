import Link from 'next/link';
import MatchaSequence from './MatchaSequence';
import styles from './Hero.module.css';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    return (
        <section className={styles.heroWrapper}>
            <div className={styles.stickyContainer}>
                {/* Background Sequence */}
                <MatchaSequence />

                {/* Overlay Content */}
                <div className={`container ${styles.overlayGrid}`}>

                    {/* Left: Primary Text */}
                    <div className={styles.leftCol}>
                        <h1 className={styles.headline}>
                            Best <br />
                            Matcha <br />
                            in Town
                        </h1>
                        <div className={styles.subHeadline}>
                            最高のお茶
                        </div>
                        <Link href="/products" className={styles.cta}>
                            Shop Now
                        </Link>
                    </div>

                    {/* Right: Scroll Indicator */}
                    <div className={styles.rightCol}>
                        <div className={styles.scrollIndicator}>
                            <span className={styles.scrollText}>SCROLL DOWN</span>
                            <div className={styles.arrowContainer}>
                                <ArrowDown
                                    className={styles.scrollIcon}
                                    color="rgba(255,255,255,0.8)"
                                    size={24}
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
