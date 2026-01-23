import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StarterKit from '@/components/StarterKit';
import Benefits from '@/components/Benefits';
import ProductCollection from '@/components/ProductCollection';
import Essentials from '@/components/Essentials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <StarterKit />
      <Benefits />
      <ProductCollection />
      <Essentials />
      <Footer />
    </main>
  );
}
