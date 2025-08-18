import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import CategoryForm from '../../components/admin/CategoryForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import CustomDropdown from '../../components/ui/CustomDropdown';
import {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useBulkUpdateCategoriesMutation
} from '../../store/api/adminApiSlice';

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, category: null });

  // API hooks
  const { data: categoriesResponse, isLoading, error, refetch } = useGetAdminCategoriesQuery();
  
  // Extract categories array from API response
  const categories = categoriesResponse?.data?.categories || categoriesResponse?.categories || [];
  
  // Debug: Log the API response structure
  if (categoriesResponse && !Array.isArray(categories)) {
    console.log('Categories API Response:', categoriesResponse);
    console.log('Extracted categories:', categories);
  }
  
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [bulkUpdateCategories, { isLoading: isBulkUpdating }] = useBulkUpdateCategoriesMutation();

  // Mock categories data
  // Data now comes from API - removed mock data

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, ...formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error?.data?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    setDeleteModal({ show: true, category });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteModal.category) return;
    
    try {
      await deleteCategory(deleteModal.category._id).unwrap();
      setDeleteModal({ show: false, category: null });
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error?.data?.message || 'Failed to delete category');
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Sort options for dropdown
  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'products', label: 'Sort by Products' },
    { value: 'recent', label: 'Sort by Recent' }
  ];

  const filteredCategories = Array.isArray(categories) ? categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'products':
        return (b.productCount || 0) - (a.productCount || 0);
      case 'recent':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:
        return 0;
    }
  });

  // Calculate summary stats
  const totalCategories = Array.isArray(categories) ? categories.length : 0;
  const activeCategories = Array.isArray(categories) ? categories.filter(cat => cat.isActive).length : 0;
  const totalProducts = Array.isArray(categories) ? categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0) : 0;

  // Show form if needed
  if (showForm) {
    return (
      <CategoryForm
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
        isLoading={isCreating || isUpdating}
        onCancel={() => {
          setShowForm(false);
          setEditingCategory(null);
        }}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error loading categories: {error?.data?.message || error.message}</p>
          <button 
            onClick={refetch} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
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
          <h1 className="text-2xl font-semibold text-neutral-900">Categories</h1>
          <p className="text-neutral-600 mt-1">Organize your products into categories</p>
        </div>
        
        <div className="flex items-center gap-3">
          <CustomDropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by Name"
            className="min-w-[160px]"
          />
          
          <button 
            onClick={handleAddCategory}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={20} />
                <span className="hidden sm:inline">Add Category</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Categories</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalCategories}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active Categories</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{activeCategories}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Products</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalProducts}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-neutral-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg border border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Category Image */}
            <div className="relative h-48 bg-neutral-100">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-neutral-400" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.isActive)}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{category.description || 'No description'}</p>
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="p-1.5 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    disabled={isDeleting}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category._id)}
                    className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-semibold text-neutral-900">{category.productCount || 0}</p>
                  <p className="text-xs text-neutral-600">Products</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-600">Slug: {category.slug}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Updated {formatDate(category.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedCategories.length === 0 && (
        <div className="bg-white rounded-lg border border-neutral-100 p-12 text-center">
          <Package size={48} className="text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No categories found</h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first category'}
          </p>
          <button 
            onClick={handleAddCategory}
            disabled={isCreating || isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isCreating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Your First Category
              </>
            )}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, category: null })}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.category?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default AdminCategories;
