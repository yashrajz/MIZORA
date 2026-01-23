# 🍵 Mizora - Premium Matcha Tea E-commerce

Mizora - Premium Matcha in Town. Elegant website featuring scroll-animated swirling matcha canvas in the hero, fixed text & CTA during animation, dark minimalist design, and Japanese-inspired luxury feel. HTML/CSS/JS + GSAP ScrollTrigger. 🍵 Best matcha experience online.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive layout optimized for all devices
- **Smooth Animations**: Enhanced user experience with Framer Motion animations
- **Interactive Components**: Engaging product displays and interactive elements
- **Matcha Sequence Animation**: Dynamic visual storytelling on the hero section

### 🛒 E-commerce Functionality
- Product collections and catalog
- Starter kit bundles
- Essentials showcase
- Benefits highlighting
- Call-to-action integration

### ⚡ Performance
- Next.js 16 App Router for optimal performance
- Server-side rendering (SSR)
- Optimized images with Next.js Image component
- Font optimization with `next/font`

### 🎯 Key Sections
- **Header**: Navigation and branding
- **Hero**: Eye-catching landing section with animated matcha sequence
- **Starter Kit**: Curated product bundles for beginners
- **Benefits**: Health and wellness benefits of matcha
- **Product Collection**: Featured products catalog
- **Essentials**: Must-have matcha accessories
- **Footer**: Additional information and links

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mizora
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Setup

Create a `.env.local` file in the root directory for environment-specific variables (if needed):

```env
# Add your environment variables here
```

## 📁 Project Structure

```
mizora/
├── public/
│   ├── images/              # Static images and assets
│   └── matcha_img_seq/      # Image sequence for animations
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Home page
│   │   └── page.module.css  # Page-specific styles
│   └── components/
│       ├── Benefits.tsx     # Benefits section
│       ├── Essentials.tsx   # Essentials section
│       ├── Footer.tsx       # Footer component
│       ├── Header.tsx       # Header/Navigation
│       ├── Hero.tsx         # Hero section
│       ├── MatchaSequence.tsx  # Animated sequence
│       ├── ProductCollection.tsx  # Product display
│       └── StarterKit.tsx   # Starter kit section
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🛠️ Built With

### Core Technologies
- **[Next.js 16.1.4](https://nextjs.org/)** - React framework for production
- **[React 19.2.3](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety

### UI & Animations
- **[Framer Motion 12.29.0](https://www.framer.com/motion/)** - Animation library
- **[Lucide React 0.562.0](https://lucide.dev/)** - Icon library
- **CSS Modules** - Scoped styling

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **ESLint Config Next** - Next.js-specific linting rules

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server on http://localhost:3000 |
| `npm run build` | Create an optimized production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

## 🎨 Component Overview

### Header
Navigation component with branding and menu items.

### Hero
Landing section featuring:
- Animated matcha image sequence
- Compelling headline ("Best Matcha in Town")
- Call-to-action button
- Japanese text (最高のお茶 - "The Best Tea")

### StarterKit
Showcases curated starter bundles for new matcha enthusiasts.

### Benefits
Highlights the health and wellness benefits of matcha with:
- Antioxidant properties
- Focus and relaxation benefits
- Visual imagery
- Icon-based feature cards using Lucide icons

### ProductCollection
Displays the main product catalog with featured items.

### Essentials
Shows must-have accessories and tools for matcha preparation.

### Footer
Contains footer links, information, and additional resources.

### MatchaSequence
Custom animation component that creates a smooth image sequence effect for visual storytelling.

## 🎯 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement CSS Modules for component styling
- Maintain consistent naming conventions

### File Naming
- Components: PascalCase (e.g., `Header.tsx`)
- Styles: Component.module.css (e.g., `Header.module.css`)
- Utilities: camelCase

### Component Structure
```tsx
import styles from './Component.module.css';

export default function Component() {
  return (
    <section className={styles.section}>
      {/* Component content */}
    </section>
  );
}
```

## 🚢 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

### Other Deployment Options

- **Netlify**: Full Next.js support with automatic deployments
- **AWS Amplify**: Scalable hosting with CI/CD
- **Docker**: Containerized deployment for any platform
- **Self-hosted**: Deploy to your own VPS or server

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed instructions.

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

### Additional Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- **The Builder** - Premium Matcha E-commerce

## 🙏 Acknowledgments

- Design inspiration from modern e-commerce best practices
- Matcha imagery and content
- Open-source community for amazing tools and libraries

---

Made with 🍵 and ❤️ by The Builder
