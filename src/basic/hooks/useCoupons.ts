// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCoupons() {
  // TODO: 구현
  // 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );

  // 2. 쿠폰 추가/삭제
  function addCoupon(coupon: Coupon) {
    setCoupons((prev) => [...prev, coupon]);
  }

  function removeCoupon(couponCode: string) {
    setCoupons((prev) => prev.filter((item) => item.code !== couponCode));
  }

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
