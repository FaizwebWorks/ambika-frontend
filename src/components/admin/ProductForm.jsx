import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useGetAdminCategoriesQuery } from '../../store/api/adminApiSlice';

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
      } else if (typeof formData[key] === 'boolean') {
        // Explicitly send boolean values as strings
        formDataToSubmit.append(key, formData[key].toString());
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
    <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-neutral-600" />
          </button>
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="Enter product title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : ''
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
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price and Discount Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : ''
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price (₹)
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.discountPrice ? 'border-red-500' : ''
                }`}
                placeholder="0.00"
              />
              {errors.discountPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.discountPrice}</p>
              )}
            </div>
          </div>

          {/* Stock and Min Order Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-500' : ''
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
              )}
            </div>

            <div>
              <label htmlFor="minOrderQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                Min Order Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="minOrderQuantity"
                name="minOrderQuantity"
                value={formData.minOrderQuantity}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minOrderQuantity ? 'border-red-500' : ''
                }`}
                placeholder="1"
              />
              {errors.minOrderQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.minOrderQuantity}</p>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <input
                type="text"
                id="material"
                name="specifications.material"
                value={formData.specifications.material}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Stainless Steel"
              />
            </div>

            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                id="dimensions"
                name="specifications.dimensions"
                value={formData.specifications.dimensions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30cm x 20cm x 15cm"
              />
            </div>

            <div>
              <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-2">
                Warranty
              </label>
              <input
                type="text"
                id="warranty"
                name="specifications.warranty"
                value={formData.specifications.warranty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1 Year"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., electric kettle, hospitality, kitchen"
            />
            <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            
            {imagePreviews.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Add More Images
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-600">Click to upload an image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
            
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
