import { useState, useCallback, useEffect } from 'react';
import { Coupon } from '../types';
import {
  initialProducts,
  initialCoupons,
  ProductWithUI,
} from './shared/config';
import { useLocalStorage } from './shared/lib/useLocalStorage';
import { useDebounce } from './shared/lib/useDebounce';
import { useNotification } from './shared/lib/useNotification';
import ProductCard from './entities/product/ui/ProductCard';
import ProductGrid from './entities/product/ui/ProductGrid';
import CouponCard from './entities/coupon/ui/CouponCard';
import { useCart } from './features/cart/model/useCart';
import CartList from './features/cart/ui/CartList';
import CartSummary from './features/cart/ui/CartSummary';
import CouponSelector from './features/coupon/ui/CouponSelector';
import ProductManagement from './features/product-management/ui/ProductManagement';

const App = () => {
  // localStorage 연동 상태 (hooks 사용)
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, removeNotification } =
    useNotification();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 장바구니 기능 (useCart 훅 사용)
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
    calculateItemTotal,
    calculateCartTotal,
  } = useCart(addNotification);

  // 디바운스 hook 사용
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

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
    [selectedCoupon, addNotification, setCoupons]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

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
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === 'error'
                  ? 'bg-red-600'
                  : notif.type === 'warning'
                  ? 'bg-yellow-600'
                  : 'bg-green-600'
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 */}
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                관리자 대시보드
              </h1>
              <p className="text-gray-600 mt-1">
                상품과 쿠폰을 관리할 수 있습니다
              </p>
            </div>
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'products'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  상품 관리
                </button>
                <button
                  onClick={() => setActiveTab('coupons')}
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
                onSetShowProductForm={setShowProductForm}
                onSetEditingProduct={setEditingProduct}
                onSetProductForm={setProductForm}
                onProductSubmit={handleProductSubmit}
                onStartEditProduct={startEditProduct}
                onDeleteProduct={deleteProduct}
                addNotification={addNotification}
              />
            ) : (
              <section className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">쿠폰 관리</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {coupons.map((coupon) => (
                      <CouponCard
                        key={coupon.code}
                        coupon={coupon}
                        onDelete={deleteCoupon}
                      />
                    ))}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                      <button
                        onClick={() => setShowCouponForm(!showCouponForm)}
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

                  {showCouponForm && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <form onSubmit={handleCouponSubmit} className="space-y-4">
                        <h3 className="text-md font-medium text-gray-900">
                          새 쿠폰 생성
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              쿠폰명
                            </label>
                            <input
                              type="text"
                              value={couponForm.name}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                              placeholder="신규 가입 쿠폰"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              쿠폰 코드
                            </label>
                            <input
                              type="text"
                              value={couponForm.code}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  code: e.target.value.toUpperCase(),
                                })
                              }
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
                              placeholder="WELCOME2024"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              할인 타입
                            </label>
                            <select
                              value={couponForm.discountType}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  discountType: e.target.value as
                                    | 'amount'
                                    | 'percentage',
                                })
                              }
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                            >
                              <option value="amount">정액 할인</option>
                              <option value="percentage">정률 할인</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {couponForm.discountType === 'amount'
                                ? '할인 금액'
                                : '할인율(%)'}
                            </label>
                            <input
                              type="text"
                              value={
                                couponForm.discountValue === 0
                                  ? ''
                                  : couponForm.discountValue
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                  setCouponForm({
                                    ...couponForm,
                                    discountValue:
                                      value === '' ? 0 : parseInt(value),
                                  });
                                }
                              }}
                              onBlur={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                if (couponForm.discountType === 'percentage') {
                                  if (value > 100) {
                                    addNotification(
                                      '할인율은 100%를 초과할 수 없습니다',
                                      'error'
                                    );
                                    setCouponForm({
                                      ...couponForm,
                                      discountValue: 100,
                                    });
                                  } else if (value < 0) {
                                    setCouponForm({
                                      ...couponForm,
                                      discountValue: 0,
                                    });
                                  }
                                } else {
                                  if (value > 100000) {
                                    addNotification(
                                      '할인 금액은 100,000원을 초과할 수 없습니다',
                                      'error'
                                    );
                                    setCouponForm({
                                      ...couponForm,
                                      discountValue: 100000,
                                    });
                                  } else if (value < 0) {
                                    setCouponForm({
                                      ...couponForm,
                                      discountValue: 0,
                                    });
                                  }
                                }
                              }}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                              placeholder={
                                couponForm.discountType === 'amount'
                                  ? '5000'
                                  : '10'
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setShowCouponForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            취소
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                          >
                            쿠폰 생성
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 상품 목록 */}
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    전체 상품
                  </h2>
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
                    {filteredProducts.map((product) => {
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cart={cart}
                          onAddToCart={addToCart}
                        />
                      );
                    })}
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
                    onUpdateQuantity={(productId, quantity) =>
                      updateQuantity(productId, quantity, products)
                    }
                    onRemove={removeFromCart}
                  />
                </section>

                {cart.length > 0 && (
                  <>
                    <CouponSelector
                      coupons={coupons}
                      selectedCoupon={selectedCoupon}
                      onApplyCoupon={applyCoupon}
                      onClearCoupon={() => setSelectedCoupon(null)}
                    />

                    <CartSummary
                      totals={calculateCartTotal()}
                      onCompleteOrder={completeOrder}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
