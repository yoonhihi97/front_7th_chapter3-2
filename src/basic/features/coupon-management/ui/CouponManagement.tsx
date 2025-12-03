import { Coupon } from '../../../../types';
import CouponGrid from './CouponGrid';
import CouponForm, { CouponFormData } from './CouponForm';

type CouponManagementProps = {
  coupons: Coupon[];
  showCouponForm: boolean;
  couponForm: CouponFormData;
  onSetShowCouponForm: (show: boolean) => void;
  onSetCouponForm: (form: CouponFormData) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onDeleteCoupon: (code: string) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
};

const CouponManagement = ({
  coupons,
  showCouponForm,
  couponForm,
  onSetShowCouponForm,
  onSetCouponForm,
  onCouponSubmit,
  onDeleteCoupon,
  addNotification,
}: CouponManagementProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponGrid
          coupons={coupons}
          onDelete={onDeleteCoupon}
          onAddClick={() => onSetShowCouponForm(!showCouponForm)}
        />

        {showCouponForm && (
          <CouponForm
            formData={couponForm}
            onSetFormData={onSetCouponForm}
            onSubmit={onCouponSubmit}
            onCancel={() => onSetShowCouponForm(false)}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponManagement;
