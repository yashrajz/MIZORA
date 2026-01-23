import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container`}>
                <div className={styles.mainGrid}>
                    <div>
                        <h2 className={styles.headline}>Save up to 50% or more <br /> on matcha powder</h2>
                        <p style={{ marginBottom: '2rem', color: '#ccc' }}>
                            Join our subscription plan and never run out of your daily calm.
                        </p>
                        <Link href="/shop" className={styles.ctaBtn}>
                            Shop Now
                        </Link>
                    </div>
                    <div className={styles.decorativeRight}>
                        <div className={styles.imagePlaceholder} style={{ position: 'relative', overflow: 'hidden' }}>
                            <Image
                                src="/images/footer_pour.png"
                                alt="Matcha Pour"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.footerNav}>
                    <div>+62 123 4567 890 • mizora@gmail.com</div>
                    <div className={styles.links}>
                        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                        <Link href="/terms" className={styles.link}>Terms & Conditions</Link>
                    </div>
                    <div>© 2024 MIZORA</div>
                </div>
            </div>
        </footer>
    );
}
