import type { Metadata } from 'next';
import Testimonials from '@/components/Testimonials';

export const metadata: Metadata = {
    title: 'Testimonials | MIZORA',
    description: 'See what our community has to say about Mizora Premium Matcha.',
};

export default function TestimonialsPage() {
    return (
        <main>
            {/* We can add a specialized hero here if needed, but Testimonials component has its own title. 
            However, usually a page has a top-level spacer or header buffer if the Header is fixed/sticky. 
            Let's ensure proper spacing. 
        */}
            <div style={{ paddingTop: '80px' }}> {/* Adjust based on Header height */}
                <Testimonials />
            </div>
        </main>
    );
}
