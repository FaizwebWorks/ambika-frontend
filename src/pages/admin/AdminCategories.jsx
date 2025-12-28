import {
  Edit,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-react';
import { LayoutGrid, List } from 'lucide-react';

import { useState } from 'react';
import CategoryForm from '../../components/admin/CategoryForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import CustomDropdown from '../../components/ui/CustomDropdown';
import {
  useBulkUpdateCategoriesMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminCategoriesQuery,
  useUpdateCategoryMutation
} from '../../store/api/adminApiSlice';

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, category: null });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'


  // API hooks (pass pagination/search/sort params)
  const { data: categoriesResponse, isLoading, error, refetch } = useGetAdminCategoriesQuery({
    page,
    limit,
    search: searchTerm,
    sort: sortBy,
    order: 'asc'
  });

  // Extract categories array and pagination from API response
  const categories = categoriesResponse?.data?.categories || categoriesResponse?.categories || [];
  const pagination = categoriesResponse?.data?.pagination || { current: page, pages: 1, total: Array.isArray(categories) ? categories.length : 0, hasNext: false, hasPrev: false };

  // Debug: Log the API response structure
  if (categoriesResponse && !Array.isArray(categories)) {
    // console.log('Categories API Response:', categoriesResponse);
    // console.log('Extracted categories:', categories);
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
        return (b.stats?.productCount || b.productCount || 0) - (a.stats?.productCount || a.productCount || 0);
      case 'recent':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:
        return 0;
    }
  });

  // Calculate summary stats
  const totalCategories = pagination?.total ?? (Array.isArray(categories) ? categories.length : 0);
  const activeCategories = Array.isArray(categories) ? categories.filter(cat => cat.isActive).length : 0;
  const totalProducts = Array.isArray(categories) ? categories.reduce((sum, cat) => sum + (cat.stats?.productCount ?? cat.productCount ?? 0), 0) : 0;

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
            onChange={(val) => { setSortBy(val); setPage(1); }}
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


          <div className="flex items-center gap-2 border border-neutral-200 rounded-lg p-1 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
                }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition ${viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
                }`}
            >
              <List size={18} />
            </button>
          </div>
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
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button> */}
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg border border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow">
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
                    <p className="text-2xl font-semibold text-neutral-900">{category?.stats?.productCount || 0}</p>
                    <p className="text-xs text-neutral-600">Products</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500">
                    Updated {formatDate(category.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr className="text-left text-sm text-neutral-600">
                <th className="p-4">Category</th>
                <th className="p-4">Products</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedCategories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b last:border-none hover:bg-neutral-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package size={20} className="text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{category.name}</p>
                        <p className="text-sm text-neutral-600 line-clamp-1">
                          {category.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-neutral-900">
                    {category.stats?.productCount ?? category.productCount ?? 0}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        category.isActive
                      )}`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-neutral-600">
                    {formatDate(category.updatedAt)}
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
      )}


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
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-neutral-600">Page {pagination.current} of {pagination.pages} — {pagination.total} items</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={pagination.current <= 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >Prev</button>
          {Array.from({ length: pagination.pages }).map((_, i) => {
            const pageNum = i + 1;
            // show only nearby pages for brevity
            if (pagination.pages > 7 && Math.abs(pageNum - pagination.current) > 3 && pageNum !== 1 && pageNum !== pagination.pages) {
              return null;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded border ${pageNum === pagination.current ? 'bg-blue-600 text-white' : ''}`}
              >{pageNum}</button>
            );
          })}
          <button
            onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
            disabled={!pagination.hasNext}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >Next</button>
        </div>
      </div>
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
