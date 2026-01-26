"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isHomePage) {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            // Sticky only after 1500px (image sequence end) on homepage
            setIsScrolled(window.scrollY > 1500);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : styles.hidden}`}>
                <div className={`container ${styles.navContainer}`}>
                    <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle menu">
                        <Menu size={24} color={isScrolled ? "white" : "white"} />
                    </button>

                    <Link href="/" className={styles.logo}>
                        MIZORA
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.link}>Home</Link>
                        <Link href="/products" className={styles.link}>Products</Link>
                        <Link href="/testimonials" className={styles.link}>Testimonials</Link>
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

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileHeader}>
                    <button className={styles.closeBtn} onClick={toggleMenu} aria-label="Close menu">
                        <X size={24} color="#0B1A12" />
                    </button>
                </div>
                <nav className={styles.mobileNavLinks}>
                    <Link href="/" className={styles.mobileLink} onClick={toggleMenu}>Home</Link>
                    <Link href="/products" className={styles.mobileLink} onClick={toggleMenu}>Products</Link>
                    <Link href="/testimonials" className={styles.mobileLink} onClick={toggleMenu}>Testimonials</Link>
                    <Link href="/signin" className={styles.mobileLink} onClick={toggleMenu}>Sign In</Link>
                </nav>
            </div>
        </>
    );
}
