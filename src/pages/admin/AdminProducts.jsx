import {
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ProductForm from '../../components/admin/ProductForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import CustomDropdown from '../../components/ui/CustomDropdown';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAdminCategoriesQuery,
  useGetAdminProductsQuery,
  useUpdateProductMutation
} from '../../store/api/adminApiSlice';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API queries
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useGetAdminProductsQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    category: filterCategory,
    status: filterStatus === 'all' ? '' : filterStatus
  }, {
    refetchOnMountOrArgChange: true
  });

  const { data: categoriesData } = useGetAdminCategoriesQuery({});

  // API mutations
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = productsData?.data?.products || [];
  const totalProducts = productsData?.data?.total || 0;
  const totalPages = productsData?.data?.totalPages || 1;``
  const categories = categoriesData?.data?.categories || [];

  // Create category options for filter
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat._id, label: cat.name }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' }
  ];

  const getStatusColor = (status, stock = 0) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-yellow-100 text-yellow-800';
    
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status, stock = 0) => {
    if (stock === 0) return <AlertCircle size={14} />;
    if (stock < 10) return <AlertCircle size={14} />;
    
    switch (status) {
      case 'active': return <CheckCircle size={14} />;
      case 'inactive': return <AlertCircle size={14} />;
      case 'draft': return <Package size={14} />;
      default: return <Package size={14} />;
    }
  };

  const getStatusText = (status, stock = 0) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData).unwrap();
      toast.success('Product created successfully!');
      setShowProductForm(false);
      refetchProducts();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      // If productData is FormData, append the id to it
      if (productData instanceof FormData) {
        productData.append('id', editingProduct._id);
        await updateProduct(productData).unwrap();
      } else {
        // For regular objects, use the old method
        await updateProduct({ 
          id: editingProduct._id, 
          ...productData 
        }).unwrap();
      }
      toast.success('Product updated successfully!');
      setShowProductForm(false);
      setEditingProduct(null);
      refetchProducts();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast.success('Product deleted successfully!');
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      refetchProducts();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  const cancelDeleteProduct = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading state
  if (productsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
            <p className="text-neutral-600 mt-1">Manage your product catalog and inventory</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                </div>
                <div className="h-8 bg-neutral-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
            <p className="text-neutral-600 mt-1">Manage your product catalog and inventory</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load products</h3>
          <p className="text-red-600 mb-4">There was an error loading the products. Please try again.</p>
          <button
            onClick={refetchProducts}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mx-auto"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
          <p className="text-neutral-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        
        <button 
          onClick={handleAddProduct}
          disabled={isCreating || isUpdating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Product
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <CustomDropdown
            options={categoryOptions}
            value={filterCategory}
            onChange={setFilterCategory}
            placeholder="All Categories"
            className="min-w-[160px]"
          />

          {/* Status Filter */}


          <button 
            onClick={async () => {
              setIsRefreshing(true);
              try {
                await refetchProducts();
                toast.success('Products refreshed successfully');
              } catch (error) {
                toast.error('Failed to refresh products');
              } finally {
                setIsRefreshing(false);
              }
            }}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Price</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Created</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{product.title}</p>
                        <p className="text-sm text-neutral-500">ID: #{product._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-neutral-600">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-neutral-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discountPrice && (
                        <div className="text-xs text-green-600">
                          {formatCurrency(product.discountPrice)} (sale)
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 10 ? 'text-yellow-600' :
                      'text-neutral-900'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status, product.stock)}`}>
                      {getStatusIcon(product.status, product.stock)}
                      {getStatusText(product.status, product.stock)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-neutral-600">
                      {formatDate(product.createdAt)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View product"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-1.5 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id, product.title)}
                        disabled={isDeleting}
                        className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || filterCategory || filterStatus 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first product'
              }
            </p>
            <button 
              onClick={handleAddProduct}
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Your First Product
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalProducts)} of {totalProducts} products
          </p>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        product={editingProduct}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteProduct}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message={
          productToDelete 
            ? `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone and will permanently remove all product data.`
            : "Are you sure you want to delete this product?"
        }
        confirmText="Delete Product"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminProducts;
