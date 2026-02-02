import styles from './Essentials.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';

// Size pricing multipliers (same as in ProductDetailClient)
const SIZE_MULTIPLIERS: Record<string, number> = {
    '30g': 1,
    '100g': 2.5,
    '200g': 4.5,
    '250g': 5.5,
    '500g': 8.5,
    'N/A': 1,
};

// Calculate minimum price (30g equivalent) for a product
const getMinPrice = (basePrice: number, baseWeight: string): number => {
    const baseSizeMultiplier = SIZE_MULTIPLIERS[baseWeight] || 1;
    const minSizeMultiplier = SIZE_MULTIPLIERS['30g'];
    return (basePrice / baseSizeMultiplier) * minSizeMultiplier;
};

export default function Essentials() {
    // Get products by slug
    const latteProduct = products.find(p => p.slug === 'matcha-latte-mix');
    const cakeProduct = products.find(p => p.slug === 'matcha-cake-powder');

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.headline}>Matcha Pairing Essentials</h2>

                <div className={styles.grid}>
                    {latteProduct && (
                        <Link href={`/products/${latteProduct.slug}`} className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.imageArea} style={{ position: 'relative' }}>
                                <Image
                                    src={latteProduct.images[0]}
                                    alt={latteProduct.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <div>
                                    <h3 className={styles.cardTitle}>{latteProduct.name}</h3>
                                    <p className={styles.cardDesc}>{latteProduct.subtitle}</p>
                                </div>
                                <span className={styles.priceBadge}>
                                    ₹{getMinPrice(latteProduct.price, latteProduct.weight).toFixed(0)}
                                </span>
                            </div>
                        </Link>
                    )}

                    {cakeProduct && (
                        <Link href={`/products/${cakeProduct.slug}`} className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.imageArea} style={{ position: 'relative' }}>
                                <Image
                                    src={cakeProduct.images[0]}
                                    alt={cakeProduct.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <div>
                                    <h3 className={styles.cardTitle}>{cakeProduct.name}</h3>
                                    <p className={styles.cardDesc}>{cakeProduct.subtitle}</p>
                                </div>
                                <span className={styles.priceBadge}>
                                    ₹{getMinPrice(cakeProduct.price, cakeProduct.weight).toFixed(0)}
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
