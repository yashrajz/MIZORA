import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import ProductDetailClient from '@/components/pdp/ProductDetailClient';

export function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const product = products.find((p) => p.slug === resolvedParams.slug);

    if (!product) {
        notFound();
    }

    return (
        <main style={{ backgroundColor: '#0B1A12', minHeight: '100vh', color: '#fff' }}>
            {/* Added padding top to account for fixed header + breadcrumb spacing */}
            <div style={{ paddingTop: '100px' }}>
                <ProductDetailClient product={product} />
            </div>
        </main>
    );
}
