'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WishlistProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    grade: string;
    subtitle: string;
}

interface WishlistItem {
    _id: string;
    productId: string;
    product: WishlistProduct | null;
    createdAt?: string;
}

interface WishlistData {
    items: WishlistItem[];
    itemCount: number;
}

interface WishlistContextType {
    wishlist: WishlistData;
    isLoading: boolean;
    error: string | null;
    addToWishlist: (productId: string) => Promise<boolean>;
    removeFromWishlist: (productId: string) => Promise<boolean>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const emptyWishlist: WishlistData = {
    items: [],
    itemCount: 0,
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistData>(emptyWishlist);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshWishlist = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/wishlist');
            const data = await res.json();

            if (data.success) {
                setWishlist(data.data);
            } else if (res.status === 401) {
                // User not logged in - wishlist is empty
                setWishlist(emptyWishlist);
            } else {
                setError(data.error || 'Failed to load wishlist');
            }
        } catch (err) {
            setError('Failed to connect to server');
            setWishlist(emptyWishlist);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load wishlist on mount
    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const addToWishlist = async (productId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();

            if (data.success) {
                await refreshWishlist();
                return true;
            } else {
                setError(data.error || 'Failed to add to wishlist');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (productId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                await refreshWishlist();
                return true;
            } else {
                setError(data.error || 'Failed to remove from wishlist');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlist.items.some(item => item.productId === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                isLoading,
                error,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
