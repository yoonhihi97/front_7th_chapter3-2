import { useProductStore } from '../../../entities/product/model/useProductStore';
import { useCartStore } from '../../../entities/cart/model/useCartStore';
import { useSearchStore } from '../../../shared/store/useSearchStore';
import { useDebounce } from '../../../shared/lib/useDebounce';
import ProductCard from '../../../entities/product/ui/ProductCard';
import ProductGrid from '../../../entities/product/ui/ProductGrid';
import CartList from '../../../features/cart/ui/CartList';
import CartSummary from '../../../features/cart/ui/CartSummary';
import CouponSelector from '../../../features/coupon/ui/CouponSelector';

const CartPage = () => {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const products = useProductStore((state) => state.products);
  const cart = useCartStore((state) => state.cart);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

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
                <ProductCard key={product.id} product={product} />
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
            <CartList />
          </section>

          {cart.length > 0 && (
            <>
              <CouponSelector />
              <CartSummary />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
