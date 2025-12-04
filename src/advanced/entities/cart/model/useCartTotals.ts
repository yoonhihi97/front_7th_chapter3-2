import { useCartStore } from './useCartStore';
import * as cartModel from './cart';

/**
 * 장바구니 총액을 계산하는 커스텀 훅
 * cart와 selectedCoupon이 변경될 때 자동으로 재계산됨
 */
export const useCartTotals = () => {
  const cart = useCartStore((state) => state.cart);
  const selectedCoupon = useCartStore((state) => state.selectedCoupon);

  return cartModel.calculateCartTotal(cart, selectedCoupon);
};
