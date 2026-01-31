'use client';

import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './ProductGrid.module.css';

export default function AllProductsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>All Products</h1>
                <p className={styles.subtitle}>Explore our complete collection of premium organic matcha and traditional accessories.</p>
            </div>

            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
