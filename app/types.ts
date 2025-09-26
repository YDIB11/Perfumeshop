// types.ts

export type RootStackParamList = {
  Home: undefined;
  Shop: undefined;
  Cart: { cart: CartItem[] };
  Payment: { amount: number };
  Success: undefined;
};

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  cartItemId?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  date: Date;
}
