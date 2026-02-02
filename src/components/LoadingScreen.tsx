'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
    onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    setTimeout(() => {
                        onLoadingComplete?.();
                    }, 800);
                    return 100;
                }
                // Smooth acceleration curve
                const increment = prev < 60 ? 2 : prev < 90 ? 1 : 0.5;
                return Math.min(prev + increment, 100);
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <div className={`${styles.container} ${isComplete ? styles.fadeOut : ''}`}>
            <div className={styles.content}>
                {/* Animated Matcha Cup */}
                <div className={styles.cupWrapper}>
                    <svg viewBox="0 0 200 200" className={styles.cup}>
                        {/* Steam particles */}
                        <g className={styles.steam}>
                            <path d="M 80 40 Q 75 25 80 10" className={styles.steam1} />
                            <path d="M 100 35 Q 95 20 100 5" className={styles.steam2} />
                            <path d="M 120 40 Q 125 25 120 10" className={styles.steam3} />
                        </g>

                        {/* Cup body */}
                        <path
                            d="M 60 80 L 50 140 Q 50 155 65 155 L 135 155 Q 150 155 150 140 L 140 80 Z"
                            className={styles.cupBody}
                        />

                        {/* Matcha liquid - fills up */}
                        <defs>
                            <clipPath id="cupClip">
                                <path d="M 60 80 L 50 140 Q 50 155 65 155 L 135 155 Q 150 155 150 140 L 140 80 Z" />
                            </clipPath>
                        </defs>

                        <g clipPath="url(#cupClip)">
                            <rect
                                x="45"
                                y={155 - (progress * 0.75)}
                                width="110"
                                height={progress * 0.75}
                                className={styles.liquid}
                            />
                            {/* Foam/froth on top */}
                            <ellipse
                                cx="100"
                                cy={155 - (progress * 0.75)}
                                rx="52"
                                ry="8"
                                className={styles.foam}
                                opacity={progress > 20 ? 1 : 0}
                            />
                        </g>

                        {/* Cup handle */}
                        <path
                            d="M 150 100 Q 170 100 170 120 Q 170 135 155 135"
                            fill="none"
                            className={styles.handle}
                        />

                        {/* Cup rim */}
                        <ellipse cx="100" cy="80" rx="45" ry="8" className={styles.rim} />
                    </svg>
                </div>

                {/* Brand name */}
                <div className={styles.brandWrapper}>
                    <h1 className={styles.brand}>MIZORA</h1>
                    <p className={styles.tagline}>最高のお茶</p>
                </div>

                {/* Progress bar */}
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Loading text */}
                <p className={styles.loadingText}>
                    {progress < 30 && 'Preparing your matcha...'}
                    {progress >= 30 && progress < 70 && 'Whisking to perfection...'}
                    {progress >= 70 && progress < 100 && 'Almost ready...'}
                    {progress === 100 && 'Enjoy!'}
                </p>
            </div>
        </div>
    );
}
