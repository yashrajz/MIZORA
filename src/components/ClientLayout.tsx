'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Check if user has already seen the loading screen in this session
        const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');

        if (hasSeenLoading) {
            setIsLoading(false);
            setShowContent(true);
        }
    }, []);

    const handleLoadingComplete = () => {
        sessionStorage.setItem('hasSeenLoading', 'true');
        setIsLoading(false);
        setTimeout(() => {
            setShowContent(true);
        }, 800);
    };

    return (
        <>
            {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
            <div style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
                {children}
            </div>
        </>
    );
}
