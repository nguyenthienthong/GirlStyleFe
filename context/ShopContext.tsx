'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  code: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'admin' | 'sales' | 'content';
  autoCreated?: boolean;
}

interface ShopContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  appliedVoucher: { code: string; discountAmount: number } | null;
  setAppliedVoucher: (voucher: { code: string; discountAmount: number } | null) => void;
  totalCartCount: number;
  totalCartPrice: number;
  isPromoPopupOpen: boolean;
  setIsPromoPopupOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAddToCartSuccessOpen: boolean;
  setIsAddToCartSuccessOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);
  const [isPromoPopupOpen, setIsPromoPopupOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isAddToCartSuccessOpen, setIsAddToCartSuccessOpen] = useState<boolean>(false);
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);

  // Auto close AddToCart Success Modal after 2 seconds (2000ms)
  useEffect(() => {
    if (isAddToCartSuccessOpen) {
      const timer = setTimeout(() => {
        setIsAddToCartSuccessOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAddToCartSuccessOpen]);

  // 1. Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('girlstyle_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }

      const savedUser = localStorage.getItem('girlstyle_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedToken = localStorage.getItem('girlstyle_token');
      if (savedToken) setToken(savedToken);

      const savedVoucher = localStorage.getItem('girlstyle_applied_voucher');
      if (savedVoucher) setAppliedVoucher(JSON.parse(savedVoucher));

      // Auto open promo popup after delay
      const hasSeenPopup = sessionStorage.getItem('girlstyle_popup_seen');
      if (!hasSeenPopup) {
        setTimeout(() => {
          setIsPromoPopupOpen(true);
          sessionStorage.setItem('girlstyle_popup_seen', 'true');
        }, 1500);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // 2. Save cart to localStorage ONLY AFTER initial load completes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('girlstyle_cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // 3. Save applied voucher to localStorage ONLY AFTER initial load completes
  useEffect(() => {
    if (isCartLoaded) {
      if (appliedVoucher) {
        localStorage.setItem('girlstyle_applied_voucher', JSON.stringify(appliedVoucher));
      } else {
        localStorage.removeItem('girlstyle_applied_voucher');
      }
    }
  }, [appliedVoucher, isCartLoaded]);

  // Save user & token
  useEffect(() => {
    if (user) localStorage.setItem('girlstyle_user', JSON.stringify(user));
    else localStorage.removeItem('girlstyle_user');

    if (token) localStorage.setItem('girlstyle_token', token);
    else localStorage.removeItem('girlstyle_token');
  }, [user, token]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevCart, newItem];
    });
    
    // Trigger Success Popup Modal (Auto-close after 2s, DO NOT open cart drawer)
    setIsAddToCartSuccessOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    localStorage.removeItem('girlstyle_cart');
    localStorage.removeItem('girlstyle_applied_voucher');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('girlstyle_user');
    localStorage.removeItem('girlstyle_token');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        user,
        setUser,
        token,
        setToken,
        logout,
        appliedVoucher,
        setAppliedVoucher,
        totalCartCount,
        totalCartPrice,
        isPromoPopupOpen,
        setIsPromoPopupOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAddToCartSuccessOpen,
        setIsAddToCartSuccessOpen
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
