import { Coupon } from '../../../../types';
import { ProductWithUI } from '../../../shared/config';
import ProductManagement from '../../../features/product-management/ui/ProductManagement';
import CouponManagement from '../../../features/coupon-management/ui/CouponManagement';
import { ProductFormData } from '../../../features/product-management/ui/ProductForm';
import { CouponFormData } from '../../../features/coupon-management/ui/CouponForm';

type AdminPageProps = {
  products: ProductWithUI[];
  coupons: Coupon[];
  activeTab: 'products' | 'coupons';
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: ProductFormData;
  showCouponForm: boolean;
  couponForm: CouponFormData;
  onSetActiveTab: (tab: 'products' | 'coupons') => void;
  onSetShowProductForm: (show: boolean) => void;
  onSetEditingProduct: (id: string | null) => void;
  onSetProductForm: (form: ProductFormData) => void;
  onProductSubmit: (e: React.FormEvent) => void;
  onStartEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onSetShowCouponForm: (show: boolean) => void;
  onSetCouponForm: (form: CouponFormData) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onDeleteCoupon: (code: string) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
};

const AdminPage = ({
  products,
  coupons,
  activeTab,
  showProductForm,
  editingProduct,
  productForm,
  showCouponForm,
  couponForm,
  onSetActiveTab,
  onSetShowProductForm,
  onSetEditingProduct,
  onSetProductForm,
  onProductSubmit,
  onStartEditProduct,
  onDeleteProduct,
  onSetShowCouponForm,
  onSetCouponForm,
  onCouponSubmit,
  onDeleteCoupon,
  addNotification,
}: AdminPageProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onSetActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => onSetActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          showProductForm={showProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          onSetShowProductForm={onSetShowProductForm}
          onSetEditingProduct={onSetEditingProduct}
          onSetProductForm={onSetProductForm}
          onProductSubmit={onProductSubmit}
          onStartEditProduct={onStartEditProduct}
          onDeleteProduct={onDeleteProduct}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          onSetShowCouponForm={onSetShowCouponForm}
          onSetCouponForm={onSetCouponForm}
          onCouponSubmit={onCouponSubmit}
          onDeleteCoupon={onDeleteCoupon}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminPage;
