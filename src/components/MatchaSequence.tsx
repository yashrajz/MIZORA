"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

const FRAME_COUNT = 31;
const IMAGE_NAME_TEMPLATE = (index: number) => {
    const str = index.toString();
    const padded = str.length >= 3 ? str : str.padStart(3, "0");
    return `/matcha_img_seq/ezgif-frame-${padded}.jpg`;
};

interface MatchaSequenceProps {
    progress?: MotionValue<number>;
}

export default function MatchaSequence({ progress }: MatchaSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // If a parent provides a progress value (0-1), use it. 
    // Otherwise fallback to global window scroll (0-1500px mapped).
    const { scrollY } = useScroll();
    const defaultScrollTransform = useTransform(scrollY, [0, 1500], [0, 1]);

    // Final normalized progress 0 -> 1
    const activeProgress = progress || defaultScrollTransform;

    // Map 0-1 to Frame 0-30
    const frameIndex = useTransform(activeProgress, [0, 1], [0, FRAME_COUNT - 1], {
        clamp: true
    });

    // 1. Preload Images
    useEffect(() => {
        let isActive = true;
        const loadImages = async () => {
            const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.src = IMAGE_NAME_TEMPLATE(i + 1); // 1-based files
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
            });

            try {
                const loadedImages = await Promise.all(promises);
                if (isActive) {
                    setImages(loadedImages);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error("Failed to preload sequence images", error);
            }
        };

        loadImages();
        return () => { isActive = false; };
    }, []);

    // 2. Render Logic
    const render = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clamp index safe guard
        let safeIndex = Math.round(index);
        if (safeIndex < 0) safeIndex = 0;
        if (safeIndex >= images.length) safeIndex = images.length - 1;

        const img = images[safeIndex];
        if (!img) return;

        // Calculate "object-fit: cover"
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        const targetRatio = cw / ch;
        const imgRatio = iw / ih;

        let sx, sy, sw, sh;

        if (imgRatio > targetRatio) {
            // Image is wider than canvas: crop sides
            sh = ih;
            sw = ih * targetRatio;
            sx = (iw - sw) / 2;
            sy = 0;
        } else {
            // Image is taller than canvas: crop top/bottom
            sw = iw;
            sh = iw / targetRatio;
            sx = 0;
            sy = (ih - sh) / 2;
        }

        // Draw
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

    }, [images]);

    // 3. Animation Loop
    useEffect(() => {
        if (!isLoaded) return;

        // Initial paint
        render(frameIndex.get());

        // React to changes
        const unsubscribe = frameIndex.on("change", (latest) => {
            requestAnimationFrame(() => render(latest));
        });

        return () => unsubscribe();
    }, [isLoaded, frameIndex, render]);

    // 4. Resize Handling
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const parent = canvasRef.current.parentElement; // or window
                // Ensure high DPI sharpness if needed, but for video sequences standard 1x is usually performant enough.
                // We'll stick to 1:1 pixel mapping for performance unless requested otherwise.
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;

                // Re-render immediately
                if (isLoaded) {
                    render(frameIndex.get());
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded, render, frameIndex]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                position: 'absolute', // Absolute to fill the parent sticky container
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.6s ease-out',
                zIndex: 0 // Behind content
            }}
        />
    );
}
