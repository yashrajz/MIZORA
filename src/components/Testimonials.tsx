import React from 'react';
import styles from './Testimonials.module.css';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Verified Buyer",
        content: "The ceremonial grade matcha is absolutely divine. The color is a vibrant emerald green and the taste is smooth with no bitterness. My morning ritual has never been better.",
        rating: 5,
    },
    {
        id: 2,
        name: "Kenji Tanaka",
        role: "Tea Sommelier",
        content: "I've tasted matcha from all over Uji and Nishio. Mizora's selection rivals the best tea houses in Kyoto. Highly recommended for authentic experience.",
        rating: 5,
    },
    {
        id: 3,
        name: "Emily Clark",
        role: "Wellness Coach",
        content: "My clients love the energy boost without the jitters. The packaging preserves freshness perfectly. It's now a staple in my wellness workshops.",
        rating: 5,
    },
    {
        id: 4,
        name: "Michael Chen",
        role: "Chef",
        content: "Using the culinary grade for my matcha tiramisu was a game changer. The flavor profile cuts through the creaminess perfectly. Excellent quality.",
        rating: 4,
    },
    {
        id: 5,
        name: "Jessica Doe",
        role: "Yoga Instructor",
        content: "Post-yoga matcha has been my thing for years, but this brand feels different. Cleaner, fresher, and I love the sustainable sourcing mission.",
        rating: 5,
    },
    {
        id: 6,
        name: "David Wright",
        role: "Architect",
        content: "Minimalist packaging, maximalist flavor. It sits beautifully on my kitchen counter and tastes even better. A premium product in every sense.",
        rating: 5,
    }
];

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i < rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: i < rating ? 1 : 0.3 }}
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            ))}
        </div>
    );
};

export default function Testimonials() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>What People Are Saying</h2>
                    <p className={styles.subtitle}>Join thousands of matcha lovers who have elevated their daily ritual with Mizora.</p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <StarRating rating={item.rating} />
                            <p className={styles.quote}>"{item.content}"</p>
                            <div className={styles.author}>
                                <div className={styles.authorInfo}>
                                    <span className={styles.name}>{item.name}</span>
                                    <span className={styles.role}>{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
