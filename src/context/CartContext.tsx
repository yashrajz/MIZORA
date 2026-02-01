'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CartProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    weight: string;
    images: string[];
    stock: number;
}

interface CartItem {
    _id: string;
    productId: string;
    quantity: number;
    selectedSize?: string;
    product: CartProduct | null;
}

interface CartData {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
}

interface CartContextType {
    cart: CartData;
    isLoading: boolean;
    error: string | null;
    addToCart: (productId: string, quantity?: number, selectedSize?: string) => Promise<boolean>;
    updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
    removeFromCart: (productId: string) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCart: CartData = {
    items: [],
    subtotal: 0,
    itemCount: 0,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartData>(emptyCart);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshCart = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/cart');
            const data = await res.json();

            if (data.success) {
                setCart(data.data);
            } else if (res.status === 401) {
                // User not logged in - cart is empty
                setCart(emptyCart);
            } else {
                setError(data.error || 'Failed to load cart');
            }
        } catch (err) {
            setError('Failed to connect to server');
            setCart(emptyCart);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load cart on mount
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId: string, quantity = 1, selectedSize?: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity, selectedSize }),
            });
            const data = await res.json();

            if (data.success) {
                await refreshCart();
                return true;
            } else {
                setError(data.error || 'Failed to add to cart');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await res.json();

            if (data.success) {
                await refreshCart();
                return true;
            } else {
                setError(data.error || 'Failed to update cart');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                await refreshCart();
                return true;
            } else {
                setError(data.error || 'Failed to remove item');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/cart?clearAll=true', {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                setCart(emptyCart);
                return true;
            } else {
                setError(data.error || 'Failed to clear cart');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                error,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

