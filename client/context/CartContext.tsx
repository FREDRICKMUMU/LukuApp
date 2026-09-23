import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";
import Toast from "react-native-toast-message";

export type cartyItem = {
    id: string;
    product: Product;
    quantity: number;
    productId: string;
    size: string;
    price: number;
}

type CartContextType = {
    cartItems: cartyItem[];
    addToCart: (product: Product, size: string) => Promise<void>;
    removeFromCart: (itemId: string, size: string) => Promise<void>;
    updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {

    const { getToken, isSignedIn } = useAuth()

    const [cartItems, setCartItems] = useState<cartyItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const token = await getToken()
            const { data } = await api.get('/cart', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success && data.data) {
                const serverCart = data.data;
                const mappedItems: cartyItem[] = serverCart.items.map((item: any) => ({
                    id: item.product._id,
                    productId: item.product._id,
                    product: item.product,
                    quantity: item.quantity,
                    size: item?.size || 'M',
                    price: item.price
                }));

                setCartItems(mappedItems);
                setCartTotal(serverCart.totalAmount);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false)
        }
    }

    const addToCart = async (product: Product, size: string) => {
        if (!isSignedIn) {
            return Toast.show({
                text1: 'Please login to add to cart',
                type: 'error',
            })
        }
        try {
            setIsLoading(true);
            const token = await getToken()
            const { data } = await api.post('/cart/add',
                { productId: product._id, quantity: 1, size },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                await fetchCart()
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            Toast.show({
                text1: 'Failed to add to cart',
                type: 'error',
            })
        } finally {
            setIsLoading(false);
        }
    }

    const removeFromCart = async (productId: string, size: string) => {
        if (!isSignedIn) return;
        try {
            setIsLoading(true);
            const token = await getToken()
            const { data } = await api.delete(`/cart/item/${productId}?size=${size}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                await fetchCart()
            }
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateQuantity = async (itemId: string, size: string, quantity: number) => {
        if (!isSignedIn) return;
        if (quantity < 1) return;

        try {
            setIsLoading(true);
            const token = await getToken()
            const { data } = await api.put(`/cart/item/${itemId}?size=${size}`,
                { quantity, size },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                await fetchCart()
            }
        } catch (error) {
            console.error("Failed to update quantity:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const clearCart = async () => {
        if (!isSignedIn) return;

        try {
            setIsLoading(true);
            const token = await getToken()
            const { data } = await api.delete('/cart', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setCartItems([]);
                setCartTotal(0);
            }
        } catch (error) {
            console.error("Failed to clear cart:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        if (isSignedIn) {
            fetchCart();
        } else {
            setCartItems([]);
            setCartTotal(0);
        }
    }, [isSignedIn])

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQuantity,
            clearCart, cartTotal, itemCount, isLoading
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context;
}