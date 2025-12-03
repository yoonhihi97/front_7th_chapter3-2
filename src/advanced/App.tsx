import { useState } from 'react';
import { useDebounce } from './shared/lib/useDebounce';
import { useNotificationStore } from './shared/store/useNotificationStore';
import { useProductStore } from './entities/product/model/useProductStore';
import { useCartStore } from './features/cart/model/useCartStore';
import Header from './widgets/header/ui/Header';
import NotificationList from './widgets/notification/ui/NotificationList';
import AdminPage from './pages/admin/ui/AdminPage';
import CartPage from './pages/cart/ui/CartPage';

const App = () => {
  // UI 상태만 (뷰 전환, 검색)
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 디바운스 hook 사용
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Zustand store에서 필요한 상태만 구독
  const products = useProductStore((state) => state.products);
  const cart = useCartStore((state) => state.cart);

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
      <NotificationList />
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
          <AdminPage />
        ) : (
          <CartPage
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
