import { ProductWithUI } from '../../../shared/config';
import { useProductStore } from '../../../entities/product/model/useProductStore';
import { useCartStore } from '../../../features/cart/model/useCartStore';
import { useCouponStore } from '../../../entities/coupon/model/useCouponStore';
import { useNotificationStore } from '../../../shared/store/useNotificationStore';
import ProductCard from '../../../entities/product/ui/ProductCard';
import ProductGrid from '../../../entities/product/ui/ProductGrid';
import CartList from '../../../features/cart/ui/CartList';
import CartSummary from '../../../features/cart/ui/CartSummary';
import CouponSelector from '../../../features/coupon/ui/CouponSelector';

type CartPageProps = {
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
};

const CartPage = ({ filteredProducts, debouncedSearchTerm }: CartPageProps) => {
  const products = useProductStore((state) => state.products);
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateItemTotal,
    calculateCartTotal,
    completeOrder,
    applyCoupon,
  } = useCartStore();
  const coupons = useCouponStore((state) => state.coupons);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleAddToCart = (product: ProductWithUI) => {
    const result = addToCart(product);
    if (result.success) {
      addNotification(result.message || '장바구니에 담았습니다', 'success');
    } else {
      addNotification(result.message || '오류가 발생했습니다', 'error');
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantity(productId, quantity, products);
    if (!result.success && result.message) {
      addNotification(result.message, 'error');
    }
  };

  const handleApplyCoupon = (coupon: typeof selectedCoupon) => {
    if (!coupon) return;
    const result = applyCoupon(coupon);
    if (result.success) {
      addNotification(result.message || '쿠폰이 적용되었습니다.', 'success');
    } else {
      addNotification(result.message || '쿠폰 적용 실패', 'error');
    }
  };

  const handleCompleteOrder = () => {
    const orderNumber = completeOrder();
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </ProductGrid>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              장바구니
            </h2>
            <CartList
              cart={cart}
              calculateItemTotal={calculateItemTotal}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={removeFromCart}
            />
          </section>

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onClearCoupon={() => setSelectedCoupon(null)}
              />

              <CartSummary
                totals={calculateCartTotal()}
                onCompleteOrder={handleCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
