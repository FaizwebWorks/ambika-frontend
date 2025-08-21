import { useState, useEffect, useRef } from 'react';
import { X, Upload, AlertCircle, Trash2, Plus, Minus } from 'lucide-react';
import { useGetAdminCategoriesQuery } from '../../store/api/adminApiSlice';
import toast from 'react-hot-toast';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    tags: '',
    status: 'active',
    specifications: {
      material: '',
      dimensions: '',
      warranty: ''
    },
    minOrderQuantity: '1',
    featured: false
  });

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetAdminCategoriesQuery({});
  const categories = categoriesData?.data?.categories || [];

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discountPrice: product.discountPrice?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category?._id || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        status: product.status || 'active',
        specifications: {
          material: product.specifications?.material || '',
          dimensions: product.specifications?.dimensions || '',
          warranty: product.specifications?.warranty || ''
        },
        minOrderQuantity: product.minOrderQuantity?.toString() || '1',
        featured: product.featured || false
      });
      setImagePreviews(product.images || []);
      setRemoveImages([]);
    } else {
      // Reset form for new product
      setFormData({
        title: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        category: '',
        tags: '',
        status: 'active',
        specifications: {
          material: '',
          dimensions: '',
          warranty: ''
        },
        minOrderQuantity: '1',
        featured: false
      });
      setImagePreviews([]);
      setImages([]);
      setRemoveImages([]);
    }
    setErrors({});
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(file.name + ' (not an image)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        invalidFiles.push(file.name + ' (too large)');
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }
    
    if (validFiles.length === 0) return;
    
    // Add to images state
    setImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const removeExistingImage = (imageUrl) => {
    setRemoveImages(prev => [...prev, imageUrl]);
    setImagePreviews(prev => prev.filter(img => img !== imageUrl));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (formData.discountPrice && (isNaN(formData.discountPrice) || parseFloat(formData.discountPrice) < 0)) {
      newErrors.discountPrice = 'Discount price must be a valid number';
    }
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      newErrors.discountPrice = 'Discount price must be less than regular price';
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.minOrderQuantity || isNaN(formData.minOrderQuantity) || parseInt(formData.minOrderQuantity) < 1) {
      newErrors.minOrderQuantity = 'Minimum order quantity must be at least 1';
    }
    
    // Check images
    const totalImages = (imagePreviews.length - removeImages.length) + images.length;
    if (totalImages === 0) {
      newErrors.images = 'At least one product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    const formDataToSubmit = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach(key => {
      if (key === 'specifications') {
        formDataToSubmit.append('specifications', JSON.stringify(formData.specifications));
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });
    
    // Append images
    images.forEach(image => {
      formDataToSubmit.append('images', image);
    });
    
    // Append images to remove (for updates)
    if (removeImages.length > 0) {
      formDataToSubmit.append('removeImages', JSON.stringify(removeImages));
    }
    
    onSubmit(formDataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                  errors.title ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Enter product title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                  errors.description ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                  errors.category ? 'border-red-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                    errors.price ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                    errors.discountPrice ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.discountPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.discountPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                    errors.stock ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.stock}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Minimum Order Quantity *
                </label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none ${
                    errors.minOrderQuantity ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="1"
                />
                {errors.minOrderQuantity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.minOrderQuantity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  name="specifications.material"
                  value={formData.specifications.material}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="e.g., Stainless Steel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="specifications.dimensions"
                  value={formData.specifications.dimensions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="e.g., 30cm x 20cm x 15cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  name="specifications.warranty"
                  value={formData.specifications.warranty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="e.g., 1 Year"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Additional Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                placeholder="e.g., electric kettle, hospitality, kitchen"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Mark as Featured Product
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Product Images</h3>
            
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-8 border-2 border-dashed border-neutral-300 rounded-lg hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
              >
                <Upload size={32} className="text-neutral-400" />
                <span className="text-neutral-600">Click to upload images</span>
                <span className="text-sm text-neutral-500">Support: JPG, PNG, GIF (Max 10MB each)</span>
              </button>
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (product && product.images.includes(preview)) {
                          removeExistingImage(preview);
                        } else {
                          removeNewImage(index);
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="border-t border-neutral-200 pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {product ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
