"use client";

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    MIZORA
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="#products" className={styles.link}>Products</Link>
                    <Link href="#testimonials" className={styles.link}>Testimonial</Link>
                </nav>

                <div className={styles.actions}>
                    <Link href="/signin" className={styles.actionLink}>
                        <span className={styles.actionText}>Sign In</span>
                    </Link>
                    <Link href="/cart" className={styles.actionLink}>
                        <span className={styles.actionText}>My Cart</span>
                        <ShoppingBag size={18} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
