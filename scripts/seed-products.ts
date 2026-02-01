import * as dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load .env.local BEFORE importing anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define Product schema directly here to avoid import issues
const ProductSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    grade: { type: String, default: '' },
    origin: { type: String, default: '' },
    weight: { type: String, default: '' },
    bestFor: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    features: [{ type: String }],
    ingredients: { type: String, default: '' },
    stock: { type: Number, default: 100 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Static products data (prices in INR)
const staticProducts = [
    {
        slug: 'ceremonial-grade-matcha',
        name: 'Ceremonial Grade Matcha',
        subtitle: 'Premium • Uji Origin • 最高の品質',
        price: 2999,
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
        ingredients: '100% Organic Green Tea Powder',
        stock: 100
    },
    {
        slug: 'premium-latte-blend',
        name: 'Premium Latte Blend',
        subtitle: 'Daily Ritual • Smooth • カフェラテ',
        price: 1999,
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
        ingredients: '100% Japanese Green Tea Powder',
        stock: 100
    },
    {
        slug: 'iced-matcha-starter-kit',
        name: 'Iced Matcha Starter Kit',
        subtitle: 'All-in-One • Essentials • 初心者セット',
        price: 4999,
        description: 'Everything you need to start your matcha journey. Includes our Premium Latte Blend (30g), a hand-crafted bamboo whisk (chasen), a stoneware whisk holder, and a signature double-walled glass. The perfect gift for yourself or a friend.',
        images: [
            '/images/kit_flatlay_new.jpg',
            '/images/kit_whisk_new.jpg',
            '/images/kit_glass_new.jpg',
            '/images/kit_unboxing_new.jpg'
        ],
        grade: 'Kit',
        origin: 'Japan',
        weight: 'Complete Set',
        bestFor: ['Beginners', 'Gifting', 'Iced Matcha'],
        rating: 4.9,
        reviews: 210,
        features: [
            '30g Premium Latte Blend included',
            'Handmade bamboo chasen (100 prong)',
            'Ceramic holder & glass'
        ],
        ingredients: 'Premium matcha, bamboo whisk, ceramic holder, glass',
        stock: 50
    },
    {
        slug: 'chasen-bamboo-whisk',
        name: 'Chasen Bamboo Whisk',
        subtitle: 'Traditional • Handcrafted • 茶筅',
        price: 1799,
        description: 'An authentic Japanese bamboo whisk handcrafted by artisans in Takayama. With 100 prongs, this chasen is designed to create the perfect froth for your matcha. Essential for the traditional tea ceremony.',
        images: [
            '/images/whisk_hero_new.jpg',
            '/images/whisk_detail_new.jpg',
            '/images/whisk_action_new.jpg',
            '/images/whisk_care_new.jpg'
        ],
        grade: 'Accessory',
        origin: 'Takayama, Japan',
        weight: '15g',
        bestFor: ['Traditional Whisking', 'Daily Use', 'Gift'],
        rating: 4.7,
        reviews: 64,
        features: [
            '100-prong design',
            'Single-piece bamboo',
            'Handcrafted by artisans'
        ],
        ingredients: '100% Natural Bamboo',
        stock: 75
    },
    {
        slug: 'matcha-bowl-chawan',
        name: 'Matcha Bowl (Chawan)',
        subtitle: 'Ceramic • Artisan Made • 茶碗',
        price: 2599,
        description: 'A beautiful handcrafted ceramic matcha bowl inspired by traditional Japanese chawan. The wide shape allows for easy whisking, while the thick walls keep your matcha warm. Each bowl is unique with subtle variations.',
        images: [
            '/images/bowl_hero_new.jpg',
            '/images/bowl_inside_new.jpg',
            '/images/bowl_matcha_new.jpg',
            '/images/bowl_set_new.jpg'
        ],
        grade: 'Accessory',
        origin: 'Mino, Japan',
        weight: '300g',
        bestFor: ['Traditional Tea', 'Display', 'Daily Use'],
        rating: 4.8,
        reviews: 42,
        features: [
            'Handcrafted ceramic',
            'Traditional wide shape',
            'Dishwasher safe'
        ],
        ingredients: 'Glazed Ceramic',
        stock: 60
    },
    {
        slug: 'organic-culinary-matcha',
        name: 'Organic Culinary Matcha',
        subtitle: 'Baking • Cooking • 料理用',
        price: 1499,
        description: 'Perfect for baking, cooking, and smoothies. This culinary grade matcha has a robust flavor that shines through in recipes. USDA Organic certified and sourced from Kagoshima, Japan.',
        images: [
            '/images/culinary_bag_new.jpg',
            '/images/culinary_powder_new.jpg',
            '/images/culinary_baking_new.jpg',
            '/images/culinary_smoothie_new.jpg'
        ],
        grade: 'Culinary',
        origin: 'Kagoshima, Japan',
        weight: '100g',
        bestFor: ['Baking', 'Smoothies', 'Cooking'],
        rating: 4.6,
        reviews: 156,
        features: [
            'USDA Organic certified',
            'Bold flavor for recipes',
            'Great value size'
        ],
        ingredients: '100% Organic Matcha Powder',
        stock: 120
    }
];

async function seedProducts() {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if products already exist
        const existingCount = await Product.countDocuments();
        if (existingCount > 0) {
            console.log(`Database already has ${existingCount} products.`);
            const forceFlag = process.argv.includes('--force');
            if (!forceFlag) {
                console.log('Use --force flag to replace existing products.');
                await mongoose.disconnect();
                process.exit(0);
            }
            // Delete existing products
            await Product.deleteMany({});
            console.log('Deleted existing products.');
        }

        // Insert all products
        const inserted = await Product.insertMany(staticProducts);
        console.log(`\n✅ Successfully seeded ${inserted.length} products to MongoDB!\n`);

        // Display inserted products
        console.log('Products added:');
        inserted.forEach((p: any, i: number) => {
            console.log(`  ${i + 1}. ${p.name} - $${p.price} - ID: ${p._id}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Done! Database disconnected.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedProducts();
