// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import * as cartModel from '../models/cart';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCart() {
  // 1. 장바구니 상태 관리 (localStorage 연동)
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 2. 상품 추가/삭제/수량 변경
  const addToCart = (product: Product) => {
    setCart((prev) => cartModel.addItemToCart(prev, product));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => cartModel.removeItemFromCart(prev, productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => cartModel.updateCartItemQuantity(prev, productId, quantity));
  };

  // 3. 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 4. 총액 계산
  const calculateTotal = () => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  };

  // 5. 재고 확인
  const getRemainingStock = (product: Product) => {
    return cartModel.getRemainingStock(product, cart);
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCart([]);
    setSelectedCoupon(null);
  };

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
  };
}
