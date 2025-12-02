import { ProductWithUI } from '../../../shared/config';
import ProductTable from './ProductTable';
import ProductForm, { ProductFormData } from './ProductForm';

type ProductManagementProps = {
  products: ProductWithUI[];
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: ProductFormData;
  onSetShowProductForm: (show: boolean) => void;
  onSetEditingProduct: (id: string | null) => void;
  onSetProductForm: (form: ProductFormData) => void;
  onProductSubmit: (e: React.FormEvent) => void;
  onStartEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
};

const ProductManagement = ({
  products,
  showProductForm,
  editingProduct,
  productForm,
  onSetShowProductForm,
  onSetEditingProduct,
  onSetProductForm,
  onProductSubmit,
  onStartEditProduct,
  onDeleteProduct,
  addNotification,
}: ProductManagementProps) => {
  const handleAddNew = () => {
    onSetEditingProduct('new');
    onSetProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    onSetShowProductForm(true);
  };

  const handleCancel = () => {
    onSetEditingProduct(null);
    onSetProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    onSetShowProductForm(false);
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

      <ProductTable
        products={products}
        onEdit={onStartEditProduct}
        onDelete={onDeleteProduct}
      />

      {showProductForm && (
        <ProductForm
          isNew={editingProduct === 'new'}
          formData={productForm}
          onSetFormData={onSetProductForm}
          onSubmit={onProductSubmit}
          onCancel={handleCancel}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductManagement;
