import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import { CartItem, Product, WishlistContextType } from "../constants/types";
import { dummyCart, dummyWishlist } from "@/assets/assets";

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
    addToCart: (product: Product,  size: string) => Promise< void>;
     removeFromCart: (itemId: string, size: string) => Promise< void>;
     updateQuantity: (itemId: string, size: string, quantity: number) => Promise< void>;
     clearCart: () => Promise< void>;
     cartTotal: number;
     itemCount: number;
     isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({children}: {children: ReactNode}) {

const [cartItems, setCartItems] = useState<cartyItem[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [cartTotal, setCartTotal] = useState(0);

   const fetchCart = async ()=>{
    setIsLoading(true);
    const serverCart = dummyCart;
    const mappedItems: cartyItem[] = serverCart.items.map((item: any)=>({
        id: item.product._id,
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        size: item?.size || 'M',
        price: item.price
    }));
    setCartItems(mappedItems);
    setCartTotal(serverCart.totalAmount);
    setIsLoading(false)
   }

   const addToCart = async (product:Product, size: string)=>{

   }

     const removeFromCart = async (producId:string, size: string)=>{
    
   }

  const updateQuantity = async (itemId: string, size: string, quantity: number) => {

}
     const clearCart = async ()=>{
    
   }

   const itemCount = cartItems.reduce((sum, item)=> sum + item.quantity,0)

   useEffect(()=>{
    fetchCart();
   },[])

   

    return (
        <CartContext.Provider value={{cartItems, addToCart, removeFromCart, updateQuantity,
            clearCart, cartTotal, itemCount, isLoading
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    const context = useContext(CartContext);
    if(context === undefined){
        throw new Error("useCart must be used within a CartProvider")
    }
    return context;
}