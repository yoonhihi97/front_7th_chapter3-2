import { Coupon } from '../../../../types';
import CouponCard from '../../../entities/coupon/ui/CouponCard';

type CouponGridProps = {
  coupons: Coupon[];
  onDelete: (code: string) => void;
  onAddClick: () => void;
};

const CouponGrid = ({ coupons, onDelete, onAddClick }: CouponGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.code} coupon={coupon} onDelete={onDelete} />
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={onAddClick}
          className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
};

export default CouponGrid;
