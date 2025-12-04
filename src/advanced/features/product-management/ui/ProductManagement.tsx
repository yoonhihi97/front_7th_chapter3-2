import { useProductStore } from '../../../entities/product/model/useProductStore';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  const showProductForm = useProductStore((state) => state.showProductForm);
  const setEditingProduct = useProductStore((state) => state.setEditingProduct);
  const setProductForm = useProductStore((state) => state.setProductForm);
  const setShowProductForm = useProductStore((state) => state.setShowProductForm);

  const handleAddNew = () => {
    setEditingProduct('new');
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable />

      {showProductForm && <ProductForm />}
    </section>
  );
};

export default ProductManagement;
