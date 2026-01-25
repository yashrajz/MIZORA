import Hero from '@/components/Hero';
import StarterKit from '@/components/StarterKit';
import Benefits from '@/components/Benefits';
import ProductCollection from '@/components/ProductCollection';
import Essentials from '@/components/Essentials';

export default function Home() {
  return (
    <main>
      <Hero />
      <StarterKit />
      <Benefits />
      <ProductCollection />
      <Essentials />
    </main>
  );
}
