export interface Product {
    id: string;
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    description: string;
    images: string[];
    grade: string;
    origin: string;
    weight: string;
    bestFor: string[];
    rating: number;
    reviews: number;
    features: string[];
    ingredients: string;
}

export const products: Product[] = [
    {
        id: '1',
        slug: 'ceremonial-grade-matcha',
        name: 'Ceremonial Grade Matcha',
        subtitle: 'Premium • Uji Origin • 最高の品質',
        price: 499,
        description: 'Our flagship Ceremonial Grade Matcha is stone-ground from the youngest tea leaves in Uji, Japan. Known for its vibrant emerald green color and sweet, creamy umami flavor without bitterness. Perfect for traditional tea ceremonies or a luxurious daily ritual.',
        images: [
            '/images/ceremonial_tin_new.jpg',
            '/images/ceremonial_powder_new.jpg',
            '/images/ceremonial_whisking_new.jpg',
            '/images/ceremonial_lifestyle_new.jpg'
        ],
        grade: 'Ceremonial',
        origin: 'Uji, Kyoto, Japan',
        weight: '30g',
        bestFor: ['Traditional Tea', 'Koicha', 'Premium Lattes'],
        rating: 4.9,
        reviews: 128,
        features: [
            'First harvest leaves only',
            'Stone-ground for 1 hour per 30g',
            'Rich in L-Theanine for calm focus'
        ],
        ingredients: '100% Organic Green Tea Powder'
    },
    {
        id: '2',
        slug: 'premium-latte-blend',
        name: 'Premium Latte Blend',
        subtitle: 'Daily Ritual • Smooth • カフェラテ',
        price: 699,
        description: 'A perfect balance of bold matcha flavor and vibrant color. This Premium Latte Blend is robust enough to stand up to your favorite milk or sweetener while retaining a smooth, non-bitter finish. Your daily energy boost, elevated.',
        images: [
            '/images/latte_pouch_new.png',
            '/images/latte_texture_new.jpg',
            '/images/latte_frothing_new.jpg',
            '/images/latte_lifestyle_new.jpg'
        ],
        grade: 'Premium',
        origin: 'Uji, Kyoto, Japan',
        weight: '100g',
        bestFor: ['Iced Lattes', 'Smoothies', 'Hot Lattes'],
        rating: 4.8,
        reviews: 85,
        features: [
            'Second harvest blend',
            'Stronger flavor profile',
            'Mixes easily with milk'
        ],
        ingredients: '100% Japanese Green Tea Powder'
    },
    {
        id: '3',
        slug: 'iced-matcha-starter-kit',
        name: 'Iced Matcha Starter Kit',
        subtitle: 'All-in-One • Essentials • 初心者セット',
        price: 699,
        description: 'Everything you need to start your matcha journey. Includes our Premium Latte Blend (30g), a hand-crafted bamboo whisk (chasen), a stoneware whisk holder, and a signature double-walled glass. The perfect gift for yourself or a friend.',
        images: [
            '/images/kit_flatlay_new.jpg',
            '/images/kit_detail_whisk_new.jpg',
            '/images/kit_packaging_box_new.jpg',
            '/images/kit_main.png' // Keeping original main as backup/end of gallery
        ],
        grade: 'Premium + Accessories',
        origin: 'Japan / Crafted Globally',
        weight: 'Kit Box',
        bestFor: ['Gifting', 'Beginners', 'Full Experience'],
        rating: 5.0,
        reviews: 42,
        features: [
            'Includes 100-prong Bamboo Whisk',
            '30g Premium Matcha Tin',
            'Ceramic Whisk Holder'
        ],
        ingredients: 'N/A'
    },
    {
        id: '4',
        slug: 'culinary-grade-matcha',
        name: 'Culinary Grade Matcha',
        subtitle: 'Baking • Cooking • 料理用',
        price: 499,
        description: 'A versatile, robust matcha designed for culinary creativity. Its bold flavor ensures the matcha taste shines through in cookies, cakes, smoothies, and ice cream. High quality enough to drink, affordable enough to bake with.',
        images: [
            '/images/culinary_pouch_main.jpg',
            '/images/culinary_powder_texture.jpg',
            '/images/culinary_action_sifting.jpg',
            '/images/culinary_lifestyle_latte.jpg'
        ],
        grade: 'Culinary',
        origin: 'Shizuoka, Japan',
        weight: '200g',
        bestFor: ['Baking', 'Cooking', 'Smoothies'],
        rating: 4.7,
        reviews: 64,
        features: [
            'Late harvest leaves',
            'Robust oxidation resistance',
            'Economical bulk size'
        ],
        ingredients: '100% Green Tea Powder'
    },
    {
        id: '5',
        slug: 'bamboo-whisk',
        name: 'Bamboo Whisk (Chasen)',
        subtitle: 'Handcrafted • Traditional • 茶筅',
        price: 199,
        description: 'A 100-prong bamboo whisk essential for whisking matcha into a perfect frothy suspension. Hand-carved from a single piece of bamboo.',
        images: [
            '/images/acc_whisk_main.png',
            '/images/kit_whisk.png',
            '/images/acc_whisk_lifestyle.jpg',
            '/images/acc_whisk_detail_new.jpg'
        ],
        grade: 'Accessory',
        origin: 'Japan',
        weight: 'N/A',
        bestFor: ['Whisking', 'Frothing'],
        rating: 4.9,
        reviews: 210,
        features: ['100% Natural Bamboo', '100 Prongs for fine foam', 'Durable construction'],
        ingredients: 'N/A'
    },
    {
        id: '6',
        slug: 'matcha-bowl',
        name: 'Matcha Bowl (Chawan)',
        subtitle: 'Ceramic • Wide-bottom • 茶碗',
        price: 499,
        description: 'A traditional ceramic bowl with a wide bottom, designed specifically to allow the bamboo whisk to move freely for optimal frothing.',
        images: [
            '/images/acc_bowl_zen.jpg',
            '/images/acc_bowl_texture.jpg',
            '/images/acc_bowl_context.jpg',
            '/images/acc_bowl_lifestyle.jpg'
        ],
        grade: 'Accessory',
        origin: 'Japan',
        weight: '300g',
        bestFor: ['Preparation', 'Drinking'],
        rating: 4.8,
        reviews: 95,
        features: ['Hand-glazed ceramic', 'Wide surface for whisking', 'Ergonomic shape'],
        ingredients: 'N/A'
    },
    {
        id: '7',
        slug: 'tea-pot',
        name: 'Kyusu Tea Pot',
        subtitle: 'Stoneware • Brewing • 急須',
        price: 599,
        description: 'A beautifully crafted Kyusu tea pot, perfect for brewing loose leaf green tea or pouring prepared lattes.',
        images: [
            '/images/acc_teapot_main.png',
            '/images/acc_teapot_texture.jpg',
            '/images/acc_teapot_action.jpg',
            '/images/acc_teapot_lifestyle.jpg'
        ],
        grade: 'Accessory',
        origin: 'Tokoname, Japan',
        weight: '400g',
        bestFor: ['Brewing', 'Pouring'],
        rating: 4.7,
        reviews: 58,
        features: ['Built-in clay strainer', 'Side handle design', 'Heat resistant'],
        ingredients: 'N/A'
    },
    {
        id: '8',
        slug: 'ceramic-whisk-holder',
        name: 'Ceramic Whisk Holder (Kusenaoshi)',
        subtitle: 'Shape Protection • Porcelain • 抹茶立て',
        price: 299,
        description: 'Essential for maintaining the shape of your bamboo whisk (chasen). This porcelain holder ensures your whisk dries properly and prevents the prongs from losing their curve.',
        images: [
            '/images/3rd.jpeg',
            '/images/1st.jpeg',
            '/images/2nd.png'
        ],
        grade: 'Accessory',
        origin: 'Japan',
        weight: '150g',
        bestFor: ['Whisk Care', 'Storage'],
        rating: 4.9,
        reviews: 45,
        features: ['Prevents mold', 'Maintains tulip shape', 'Minimalist design'],
        ingredients: 'N/A'
    },
    {
        id: '9',
        slug: 'stainless-steel-sifter',
        name: 'Matcha Sifter (Furui)',
        subtitle: 'Fine Mesh • Stainless Steel • 篩',
        price: 199,
        description: 'A dedicated fine-mesh sifter to remove clumps from your matcha powder before whisking, ensuring a perfectly smooth and foam-rich tea every time.',
        images: [
            '/images/sifft_texture_new.jpg',
            '/images/sifft_action_new.jpg'
        ],
        grade: 'Accessory',
        origin: 'Japan',
        weight: '80g',
        bestFor: ['Preparation', 'Baking'],
        rating: 4.8,
        reviews: 112,
        features: ['Fine mesh screen', 'Ergonomic handle', 'Rust-resistant'],
        ingredients: 'N/A'
    },
    {
        id: '10',
        slug: 'hojicha-powder',
        name: 'Roasted Green Tea (Hojicha)',
        subtitle: 'Roasted • Low Caffeine • ほうじ茶',
        price: 599,
        description: 'Finely ground roasted green tea powder. Hojicha has a nutty, caramel-like flavor with hints of cocoa. Lower in caffeine, making it a perfect evening latte option.',
        images: ['/images/culinary_powder_texture.jpg', '/images/latte_pouch_new.png'], // Placeholder: using texture, need brown image ideally
        grade: 'Premium',
        origin: 'Kyoto, Japan',
        weight: '100g',
        bestFor: ['Lattes', 'Baking', 'PM Drinking'],
        rating: 4.9,
        reviews: 76,
        features: ['Slow roasted', 'Sweet nutty flavor', 'Low caffeine'],
        ingredients: '100% Roasted Green Tea'
    },
    {
        id: '11',
        slug: 'matcha-latte-mix',
        name: 'Matcha Latte Mix',
        subtitle: 'Sweetened • Monk Fruit • ラテ素',
        price: 749,
        description: 'Ready-to-mix organic matcha blend pre-sweetened with monk fruit. Create a perfect matcha latte in seconds—just add milk (dairy or plant-based). Zero added sugar, 100% delicious.',
        images: [
            '/images/essential_latte.png',
            '/images/latte_frothing_new.jpg',
            '/images/latte_lifestyle_new.jpg'
        ],
        grade: 'Latte Blend',
        origin: 'Shizuoka, Japan',
        weight: '250g',
        bestFor: ['Quick Lattes', 'Travel', 'Sweet Tooth'],
        rating: 4.8,
        reviews: 156,
        features: ['Sweetened with Monk Fruit', 'Dissolves instantly', 'Keto friendly'],
        ingredients: 'Organic Matcha, Erythritol, Monk Fruit Extract'
    },
    {
        id: '12',
        slug: 'matcha-cake-powder',
        name: 'Matcha Cake Powder',
        subtitle: 'Baking • Vibrant Color • 製菓用',
        price: 599,
        description: 'Specialized culinary grade matcha processed to retain its vibrant green color even after baking at high temperatures. Perfect for cakes, cookies, and pastries.',
        images: [
            '/images/essential_cake.png',
            '/images/culinary_action_sifting.jpg',
            '/images/culinary_pouch_main.jpg'
        ],
        grade: 'Culinary Professional',
        origin: 'Kagoshima, Japan',
        weight: '100g',
        bestFor: ['Baking', 'Pastries', 'Frosting'],
        rating: 4.9,
        reviews: 89,
        features: ['Heat-stable color', 'Strong flavor retention', 'Ultra-fine grind'],
        ingredients: '100% Green Tea Powder'
    }
];
