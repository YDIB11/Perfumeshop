// contexts/ShopContext.tsx

import React, { createContext, useState, useContext, ReactNode } from "react";
import { CartItem, Order } from "../app/types";

interface Discount {
  code: string;
  type: "percentage" | "amount";
  value: number;
}

interface ShopContextProps {
  products: CartItem[];
  setProducts: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  userRatings: Record<string, number>;
  setUserRatings: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  wishlist: CartItem[];
  setWishlist: React.Dispatch<React.SetStateAction<CartItem[]>>;
  discounts: Discount[];
  applyDiscount: (code: string) => boolean;
  appliedDiscount: Discount | null;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<CartItem[]>([
    {
      id: "1",
      name: "XERJOFF, More Than Words Eau de Parfum, 50 ml",
      price: 180.35,
      category: "Fragrance",
      imageUrl:
        "https://co.nice-cdn.com/upload/image/product/large/default/xerjoff-more-than-words-eau-de-parfum-50-ml-532251-en.png",
    },
    {
      id: "2",
      name: "XERJOFF, Renaissance Eau de Parfum, 100 ml",
      price: 245.49,
      category: "car",
      imageUrl:
        "https://co.nice-cdn.com/upload/image/product/large/default/29246_46a3ded1.1024x1024.png",
    },
    {
      id: "3",
      name: "XERJOFF, ALEXANDRIA II Eau de Parfum, 100ml",
      price: 340.0,
      category: "Fragrance",
      imageUrl: "https://www.galaxus.ch/im/Files/6/7/6/1/9/4/6/0/3381.png",
    },
    {
      id: "4",
      name: "XERJOFF, Opera Eau de Parfum, 50 ml",
      price: 210.41,
      category: "Fragrance",
      imageUrl:
        "https://co.nice-cdn.com/upload/image/product/large/default/29281_c421677b.1024x1024.png",
    },
    {
      id: "5",
      name: "XERJOFF, Naxos Eau de Parfum, 100 ml",
      price: 245.49,
      category: "Fragrance",
      imageUrl:
        "https://co.nice-cdn.com/upload/image/product/large/default/29242_229ba6f7.1024x1024.png",
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

  const discounts: Discount[] = [
    { code: "SAVE10", type: "percentage", value: 10 },
    { code: "OFF50", type: "amount", value: 50 },
  ];

  const applyDiscount = (code: string): boolean => {
    const discount = discounts.find(
      (d) => d.code.toUpperCase() === code.toUpperCase()
    );
    if (discount) {
      setAppliedDiscount(discount);
      return true;
    } else {
      setAppliedDiscount(null);
      return false;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        cart,
        setCart,
        orders,
        setOrders,
        userRatings,
        setUserRatings,
        wishlist,
        setWishlist,
        discounts,
        applyDiscount,
        appliedDiscount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};
