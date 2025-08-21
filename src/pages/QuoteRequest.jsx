import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { useGetPublicProductByIdQuery } from '../store/api/publicApiSlice';
import { useCreateQuoteRequestMutation } from '../store/api/authApiSlice';
import { 
  ArrowLeft, 
  FileText, 
  Package, 
  MapPin, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';

const QuoteRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  // Fetch product data if product ID is provided
  const { 
    data: productResponse, 
    isLoading: productLoading 
  } = useGetPublicProductByIdQuery(productId, {
    skip: !productId
  });
  
  const [createQuoteRequest, { isLoading: isSubmitting }] = useCreateQuoteRequestMutation();
  
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryTimeline: '',
    additionalRequirements: '',
    businessJustification: '',
    budgetRange: {
      min: '',
      max: ''
    }
  });
  
  const [items, setItems] = useState([]);
  
  // Initialize with product if provided
  useEffect(() => {
    if (productResponse?.data?.product) {
      const product = productResponse.data.product;
      setItems([{
        product: product._id,
        productData: product,
        quantity: product.minOrderQuantity || 1,
        size: '',
        customRequirements: '',
        urgency: 'Standard'
      }]);
    }
  }, [productResponse]);
  
  // Redirect if not B2B customer
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (currentUser?.customerType !== 'B2B') {
      toast.error('Quote requests are only available for B2B customers');
      navigate('/');
      return;
    }
    
    if (currentUser?.approvalStatus !== 'approved') {
      toast.error('Your B2B account needs to be approved before requesting quotes');
      navigate('/');
      return;
    }
  }, [isLoggedIn, currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('budgetRange.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        budgetRange: {
          ...prev.budgetRange,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleItemChange = (index, field, value) => {
    setItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleQuantityChange = (index, change) => {
    setItems(prev => 
      prev.map((item, i) => {
        if (i === index) {
          const newQuantity = Math.max(
            item.productData?.minOrderQuantity || 1,
            item.quantity + change
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };
  
  const addItem = () => {
    setItems(prev => [...prev, {
      product: '',
      productData: null,
      quantity: 1,
      size: '',
      customRequirements: '',
      urgency: 'Standard'
    }]);
  };
  
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (items.length === 0) {
      toast.error('At least one item is required');
      return;
    }
    
    if (!formData.deliveryAddress.trim()) {
      toast.error('Delivery address is required');
      return;
    }
    
    if (!formData.deliveryTimeline.trim()) {
      toast.error('Delivery timeline is required');
      return;
    }
    
    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product) {
        toast.error(`Product is required for item ${i + 1}`);
        return;
      }
      if (item.quantity < 1) {
        toast.error(`Valid quantity is required for item ${i + 1}`);
        return;
      }
    }
    
    try {
      const quoteData = {
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          customRequirements: item.customRequirements,
          urgency: item.urgency
        })),
        deliveryAddress: formData.deliveryAddress,
        deliveryTimeline: formData.deliveryTimeline,
        additionalRequirements: formData.additionalRequirements,
        businessJustification: formData.businessJustification,
        budgetRange: {
          min: parseFloat(formData.budgetRange.min) || undefined,
          max: parseFloat(formData.budgetRange.max) || undefined
        }
      };
      
      const result = await createQuoteRequest(quoteData).unwrap();
      
      toast.success('Quote request submitted successfully!', {
        duration: 4000,
        position: 'top-center',
      });
      
      // Navigate to quote requests list
      navigate('/quote-requests');
      
    } catch (error) {
      console.error('Quote request failed:', error);
      
      const errorMessage = error?.data?.message || 'Failed to submit quote request';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };
  
  if (!isLoggedIn || currentUser?.customerType !== 'B2B') {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-medium text-neutral-800">Request Quote</h1>
              <p className="text-sm text-neutral-500">Submit a bulk order request for B2B pricing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Info Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-blue-800">Quote Request</h2>
                <p className="text-blue-600 text-sm">Company: {currentUser?.businessDetails?.companyName}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-700">Business Type:</span>
                  <span className="ml-2 text-neutral-600">{currentUser?.businessDetails?.businessType}</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Contact Person:</span>
                  <span className="ml-2 text-neutral-600">{currentUser?.businessDetails?.contactPerson}</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Business Email:</span>
                  <span className="ml-2 text-neutral-600">{currentUser?.businessDetails?.businessEmail}</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Business Phone:</span>
                  <span className="ml-2 text-neutral-600">{currentUser?.businessDetails?.businessPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              Items for Quote
            </h2>
            
            {items.map((item, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-neutral-800">Item {index + 1}</h3>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {item.productData && (
                  <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productData.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.productData.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium text-neutral-800">{item.productData.title}</h4>
                        <p className="text-sm text-neutral-600">{item.productData.category?.name}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Quantity *
                    </label>
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(index, -1)}
                        className="p-2 hover:bg-neutral-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(index, 1)}
                        className="p-2 hover:bg-neutral-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {item.productData?.minOrderQuantity && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Min order: {item.productData.minOrderQuantity} units
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Size (if applicable)
                    </label>
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      placeholder="Select size"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Urgency
                    </label>
                    <select
                      value={item.urgency}
                      onChange={(e) => handleItemChange(index, 'urgency', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Custom Requirements
                    </label>
                    <input
                      type="text"
                      value={item.customRequirements}
                      onChange={(e) => handleItemChange(index, 'customRequirements', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      placeholder="Any special requirements"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              + Add Another Item
            </button>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Delivery Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                  placeholder="Enter complete delivery address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Required Delivery Timeline *
                </label>
                <input
                  type="text"
                  name="deliveryTimeline"
                  value={formData.deliveryTimeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                  placeholder="e.g., Within 2 weeks, By March 15th, ASAP"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Additional Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Budget Range (Optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="budgetRange.min"
                      value={formData.budgetRange.min}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      placeholder="Minimum budget"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="budgetRange.max"
                      value={formData.budgetRange.max}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      placeholder="Maximum budget"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Business Justification
                </label>
                <textarea
                  name="businessJustification"
                  value={formData.businessJustification}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                  placeholder="Explain the business need for this purchase"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Additional Requirements
                </label>
                <textarea
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                  placeholder="Any special instructions, packaging requirements, etc."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-6 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequest;
