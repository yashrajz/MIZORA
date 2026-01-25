import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
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
                    <Link href={`/products/${product.slug}`} key={product.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            {/* Use the first image in the array as the thumbnail */}
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.meta}>
                                <span className={styles.grade}>{product.grade}</span>
                                <span className={styles.price}>${product.price}</span>
                            </div>
                            <h2 className={styles.name}>{product.name}</h2>
                            <p className={styles.subtitle_card}>{product.subtitle}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
