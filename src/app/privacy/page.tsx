import Link from 'next/link';
import styles from '../not-found.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.illustration}>
                    <svg viewBox="0 0 400 400" className={styles.blender}>
                        {/* Blender Base */}
                        <ellipse cx="200" cy="360" rx="60" ry="15" fill="#0B1A12" opacity="0.3" />

                        {/* Blender Body */}
                        <path d="M 150 280 L 140 360 L 260 360 L 250 280 Z" fill="#2D5F4A" stroke="#1A3D2E" strokeWidth="3" />

                        {/* Blender Cup */}
                        <path d="M 160 180 L 150 280 L 250 280 L 240 180 Z" fill="#E8F5E9" stroke="#2D5F4A" strokeWidth="3" opacity="0.6" />

                        {/* Matcha Liquid */}
                        <path d="M 165 220 L 158 270 L 242 270 L 235 220 Z" fill="#B9FF3D" opacity="0.7" />

                        {/* Measurement Lines */}
                        <line x1="155" y1="240" x2="170" y2="240" stroke="#2D5F4A" strokeWidth="2" />
                        <line x1="155" y1="260" x2="170" y2="260" stroke="#2D5F4A" strokeWidth="2" />

                        {/* Blender Lid */}
                        <ellipse cx="200" cy="180" rx="45" ry="8" fill="#2D5F4A" stroke="#1A3D2E" strokeWidth="2" />
                        <rect x="190" y="160" width="20" height="20" rx="3" fill="#2D5F4A" stroke="#1A3D2E" strokeWidth="2" />

                        {/* Control Buttons */}
                        <circle cx="180" cy="330" r="8" fill="#0B1A12" opacity="0.5" />
                        <circle cx="200" cy="330" r="8" fill="#B9FF3D" opacity="0.8" />
                        <circle cx="220" cy="330" r="8" fill="#0B1A12" opacity="0.5" />

                        {/* Power Cord */}
                        <path d="M 260 320 Q 300 300 320 280 Q 340 260 350 220"
                            fill="none" stroke="#2D5F4A" strokeWidth="4" strokeLinecap="round" />

                        {/* Plug */}
                        <rect x="340" y="200" width="25" height="35" rx="5" fill="#2D5F4A" stroke="#1A3D2E" strokeWidth="2" />
                        <rect x="345" y="195" width="6" height="10" rx="2" fill="#1A3D2E" />
                        <rect x="354" y="195" width="6" height="10" rx="2" fill="#1A3D2E" />

                        {/* Electricity Sparks */}
                        <path d="M 330 180 L 340 195 L 335 195 L 345 210"
                            fill="none" stroke="#B9FF3D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 355 170 L 365 185 L 360 185 L 370 200"
                            fill="none" stroke="#B9FF3D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className={styles.textContent}>
                    <p className={styles.subtitle}>Oops! This page is still brewing.</p>
                    <h1 className={styles.title}>privacy policy coming soon!</h1>
                    <p className={styles.message}>We're crafting our privacy policy with the same care we put into our matcha.</p>

                    <div className={styles.actions}>
                        <Link href="/" className={styles.btnPrimary}>
                            Go Home
                        </Link>
                        <Link href="/#products" className={styles.btnSecondary}>
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
