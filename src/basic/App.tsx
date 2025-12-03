import { useState } from 'react';
import { useDebounce } from './shared/lib/useDebounce';
import { useNotification } from './shared/lib/useNotification';
import { useCart } from './features/cart/model/useCart';
import { useProductManagement } from './features/product-management/model';
import { useCouponManagement } from './features/coupon-management/model';
import Header from './widgets/header/ui/Header';
import NotificationList from './widgets/notification/ui/NotificationList';
import AdminPage from './pages/admin/ui/AdminPage';
import CartPage from './pages/cart/ui/CartPage';

const App = () => {
  // UI 상태만 (뷰 전환, 검색)
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  // 디바운스 hook 사용
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 비즈니스 로직은 각 feature의 model에서
  const { notifications, addNotification, removeNotification } =
    useNotification();

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

  const {
    products,
    editingProduct,
    showProductForm,
    productForm,
    setEditingProduct,
    setShowProductForm,
    setProductForm,
    handleProductSubmit,
    startEditProduct,
    deleteProduct,
  } = useProductManagement(addNotification);

  const {
    coupons,
    showCouponForm,
    couponForm,
    setShowCouponForm,
    setCouponForm,
    handleCouponSubmit,
    deleteCoupon,
  } = useCouponManagement(addNotification, selectedCoupon, setSelectedCoupon);

  // 파생 상태
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      <NotificationList
        notifications={notifications}
        onRemove={removeNotification}
      />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        totalItemCount={totalItemCount}
        cartLength={cart.length}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            activeTab={activeTab}
            showProductForm={showProductForm}
            editingProduct={editingProduct}
            productForm={productForm}
            showCouponForm={showCouponForm}
            couponForm={couponForm}
            onSetActiveTab={setActiveTab}
            onSetShowProductForm={setShowProductForm}
            onSetEditingProduct={setEditingProduct}
            onSetProductForm={setProductForm}
            onProductSubmit={handleProductSubmit}
            onStartEditProduct={startEditProduct}
            onDeleteProduct={deleteProduct}
            onSetShowCouponForm={setShowCouponForm}
            onSetCouponForm={setCouponForm}
            onCouponSubmit={handleCouponSubmit}
            onDeleteCoupon={deleteCoupon}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            calculateItemTotal={calculateItemTotal}
            calculateCartTotal={calculateCartTotal}
            onAddToCart={addToCart}
            onUpdateQuantity={(productId, quantity) =>
              updateQuantity(productId, quantity, products)
            }
            onRemoveFromCart={removeFromCart}
            onApplyCoupon={applyCoupon}
            onClearCoupon={() => setSelectedCoupon(null)}
            onCompleteOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
