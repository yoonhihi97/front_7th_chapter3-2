import { useState, useCallback } from 'react';
import { Coupon } from '../../../../types';
import { initialCoupons } from '../../../shared/config';
import { useLocalStorage } from '../../../shared/lib/useLocalStorage';

export type CouponFormData = {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
};

const initialCouponForm: CouponFormData = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

export function useCouponManagement(
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void,
  selectedCoupon: Coupon | null,
  setSelectedCoupon: (coupon: Coupon | null) => void
) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponFormData>(initialCouponForm);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, setCoupons, setSelectedCoupon]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      setCouponForm(initialCouponForm);
      setShowCouponForm(false);
    },
    [couponForm, addCoupon]
  );

  return {
    // 상태
    coupons,
    showCouponForm,
    couponForm,
    // 상태 변경
    setShowCouponForm,
    setCouponForm,
    // 액션
    handleCouponSubmit,
    deleteCoupon,
  };
}
