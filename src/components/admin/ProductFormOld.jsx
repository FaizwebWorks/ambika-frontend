import { useState, useEffect, useRef } from 'react';
import { X, Upload, AlertCircle, Trash2 } from 'lucide-react';
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
    features: '',
    specifications: '',
    quality: '',
    sizes: [],
    minOrderQuantity: '1',
    maxOrderQuantity: '',
    material: '',
    dimensions: '',
    weight: '',
    warranty: '',
    certifications: '',
    usage: '',
    packaging: '',
    targetCustomers: ['B2C', 'B2B'],
    featured: false,
    b2bPricingEnabled: true,
    showPriceToGuests: false,
    priceOnRequest: true,
    bulkPricing: [{ minQuantity: 1, pricePerUnit: '', discount: 0 }]
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
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        category: product.category?._id || product.category || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
        status: product.status || 'active',
        features: Array.isArray(product.features) ? product.features.join('\n') : product.features || '',
        specifications: typeof product.specifications === 'object' 
          ? Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join('\n')
          : product.specifications || '',
        quality: product.quality || '',
        sizes: product.sizes || [],
        minOrderQuantity: product.minOrderQuantity || '1',
        maxOrderQuantity: product.maxOrderQuantity || '',
        material: product.specifications?.material || '',
        dimensions: product.specifications?.dimensions || '',
        weight: product.specifications?.weight || '',
        warranty: product.specifications?.warranty || '',
        certifications: Array.isArray(product.specifications?.certifications) 
          ? product.specifications.certifications.join(', ') : '',
        usage: product.specifications?.usage || '',
        packaging: product.specifications?.packaging || '',
        targetCustomers: product.targetCustomers || ['B2C', 'B2B'],
        featured: product.featured || false,
        b2bPricingEnabled: product.b2bPricing?.enabled !== false,
        showPriceToGuests: product.b2bPricing?.showPriceToGuests || false,
        priceOnRequest: product.b2bPricing?.priceOnRequest !== false,
        bulkPricing: product.b2bPricing?.bulkPricing?.length > 0 
          ? product.b2bPricing.bulkPricing 
          : [{ minQuantity: 1, pricePerUnit: '', discount: 0 }]
      });
      
      // Set existing images for preview
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
      }
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
        features: '',
        specifications: '',
        quality: '',
        sizes: [],
        minOrderQuantity: '1',
        maxOrderQuantity: '',
        material: '',
        dimensions: '',
        weight: '',
        warranty: '',
        certifications: '',
        usage: '',
        packaging: '',
        targetCustomers: ['B2C', 'B2B'],
        featured: false,
        b2bPricingEnabled: true,
        showPriceToGuests: false,
        priceOnRequest: true,
        bulkPricing: [{ minQuantity: 1, pricePerUnit: '', discount: 0 }]
      });
      setImages([]);
      setImagePreviews([]);
      setRemoveImages([]);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleTargetCustomerChange = (customer) => {
    setFormData(prev => ({
      ...prev,
      targetCustomers: prev.targetCustomers.includes(customer) 
        ? prev.targetCustomers.filter(c => c !== customer)
        : [...prev.targetCustomers, customer]
    }));
  };

  const addBulkPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: [...prev.bulkPricing, { minQuantity: '', pricePerUnit: '', discount: 0 }]
    }));
  };

  const removeBulkPricingTier = (index) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
  };

  const updateBulkPricingTier = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Validate total number of images
    if (images.length + imagePreviews.length + files.length > maxImages) {
      setErrors(prev => ({ ...prev, images: `Maximum ${maxImages} images allowed` }));
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, images: 'Please select valid image files (JPEG, PNG, WEBP)' }));
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, images: 'Each image should be less than 5MB' }));
        continue;
      }

      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index || i < imagePreviews.length - images.length));
  };

  const removeExistingImage = (imageUrl) => {
    setImagePreviews(prev => prev.filter(url => url !== imageUrl));
    setRemoveImages(prev => [...prev, imageUrl]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Process form data
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      stock: parseInt(formData.stock),
      minOrderQuantity: parseInt(formData.minOrderQuantity) || 1,
      maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity) : undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      features: formData.features ? formData.features.split('\n').map(feature => feature.trim()).filter(Boolean) : [],
      specifications: {
        material: formData.material || undefined,
        dimensions: formData.dimensions || undefined,
        weight: formData.weight || undefined,
        warranty: formData.warranty || undefined,
        certifications: formData.certifications ? formData.certifications.split(',').map(cert => cert.trim()).filter(Boolean) : [],
        usage: formData.usage || undefined,
        packaging: formData.packaging || undefined,
        features: formData.features ? formData.features.split('\n').map(feature => feature.trim()).filter(Boolean) : []
      },
      b2bPricing: {
        enabled: formData.b2bPricingEnabled,
        showPriceToGuests: formData.showPriceToGuests,
        priceOnRequest: formData.priceOnRequest,
        bulkPricing: formData.bulkPricing.filter(tier => 
          tier.minQuantity && tier.pricePerUnit
        ).map(tier => ({
          minQuantity: parseInt(tier.minQuantity),
          maxQuantity: tier.maxQuantity ? parseInt(tier.maxQuantity) : undefined,
          pricePerUnit: parseFloat(tier.pricePerUnit),
          discount: parseFloat(tier.discount) || 0
        }))
      }
    };

    // Add images if any
    if (images.length > 0) {
      processedData.images = images;
    }

    // Add remove images if editing
    if (removeImages.length > 0) {
      processedData.removeImages = removeImages;
    }

    onSubmit(processedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="0.00"
                />
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
                  {categories.map((category) => (
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

            {/* Quality and Order Quantities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quality Level
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Select Quality</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Min Order Quantity
                </label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Max Order Quantity
                </label>
                <input
                  type="number"
                  name="maxOrderQuantity"
                  value={formData.maxOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {['Small', 'Medium', 'Large', 'XL', 'XXL', 'XXXL', 'Custom'].map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="mr-2"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Customers */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Target Customers
              </label>
              <div className="flex gap-4">
                {['B2C', 'B2B'].map(customer => (
                  <label key={customer} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetCustomers.includes(customer)}
                      onChange={() => handleTargetCustomerChange(customer)}
                      className="mr-2"
                    />
                    <span className="text-sm">{customer === 'B2C' ? 'Business to Consumer' : 'Business to Business'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured Product */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-neutral-700">Featured Product</span>
              </label>
            </div>

            {/* Product Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2">
                Product Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., Stainless Steel, Plastic, Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., 10 x 10 x 5 cm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., 500g, 1.2kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., 1 year, 6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Usage
                  </label>
                  <input
                    type="text"
                    name="usage"
                    value={formData.usage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., Daily cleaning, Kitchen use"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Packaging
                  </label>
                  <input
                    type="text"
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., Box of 12, Individual pack"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  placeholder="e.g., ISO 9001, FDA Approved, CE Marked"
                />
              </div>
            </div>

            {/* B2B Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2">
                B2B Pricing Settings
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="b2bPricingEnabled"
                    checked={formData.b2bPricingEnabled}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-neutral-700">Enable B2B Pricing</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showPriceToGuests"
                    checked={formData.showPriceToGuests}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-neutral-700">Show Price to Guests (Non-logged in users)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="priceOnRequest"
                    checked={formData.priceOnRequest}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-neutral-700">Price on Request</span>
                </label>
              </div>

              {/* Bulk Pricing Tiers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-neutral-700">
                    Bulk Pricing Tiers
                  </label>
                  <button
                    type="button"
                    onClick={addBulkPricingTier}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Tier
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.bulkPricing.map((tier, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-neutral-200 rounded-lg">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Min Qty</label>
                        <input
                          type="number"
                          value={tier.minQuantity}
                          onChange={(e) => updateBulkPricingTier(index, 'minQuantity', e.target.value)}
                          className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Max Qty</label>
                        <input
                          type="number"
                          value={tier.maxQuantity || ''}
                          onChange={(e) => updateBulkPricingTier(index, 'maxQuantity', e.target.value)}
                          className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Price/Unit (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={tier.pricePerUnit}
                          onChange={(e) => updateBulkPricingTier(index, 'pricePerUnit', e.target.value)}
                          className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeBulkPricingTier(index)}
                          className="w-full px-2 py-1 text-red-600 hover:text-red-700 text-sm border border-red-300 rounded hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
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

            {/* Tags */}
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
                placeholder="e.g. cleaning, essential, premium"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Features (one per line)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Specifications (key: value format, one per line)
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                placeholder="Weight: 500g&#10;Dimensions: 10x10x5 cm&#10;Material: Plastic"
              />
            </div>

            {/* Status */}
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

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Images (Max 5)
              </label>
              
              {/* Current Images Preview */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof image === 'string' ? image : image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof image === 'string') {
                            removeExistingImage(image);
                          } else {
                            removeNewImage(index);
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              {imagePreviews.length < 5 && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload images</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB each</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
