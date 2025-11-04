import { Building2, Calendar, FileText, Loader2, Package, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useGetQuotationByIdQuery, useRespondToQuotationMutation } from '../../store/api/quotationApiSlice';

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    data,
    isLoading,
    isError,
  } = useGetQuotationByIdQuery(id);

  const [respondToQuotation] = useRespondToQuotationMutation();

  console.log('API Response:', data);
  const quotation = data?.data?.quotation;
  console.log('Quotation Data:', quotation);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRespond = async (newStatus) => {
    try {
      setIsSubmitting(true);
      console.log('Sending response:', {
        id,
        status: newStatus,
        unitPrice: quotation?.product?.price,
      });
      
      await respondToQuotation({
        id,
        data: {
          status: newStatus,
          adminNotes: `Quotation ${newStatus} via admin panel`,
          unitPrice: quotation?.product?.price || 0,
          validityDays: 7
        }
      }).unwrap();
      
      toast.success(`Quotation ${newStatus} successfully`);
      navigate('/admin/quotations');
    } catch (error) {
      console.error('Error Response:', error);
      toast.error(error.data?.message || error.message || 'Failed to process quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading quotation details</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  if (!data?.data?.quotation) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">No quotation data found</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Quotation Request #{quotation?._id?.slice(-6)}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Requested on {formatDate(quotation?.createdAt)}
            </span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(quotation?.status)}`}>
              {quotation?.status?.charAt(0).toUpperCase() + quotation?.status?.slice(1)}
            </span>
          </div>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          Back to List
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-lg">Business Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Company Name</label>
              <p className="font-medium">{quotation?.customer?.businessDetails?.companyName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Contact Person</label>
              <p className="font-medium">{quotation?.customer?.businessDetails?.contactPerson || 'N/A'}</p>
              <p className="text-sm text-gray-600">{quotation?.customer?.businessDetails?.designation || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Contact Details</label>
              <p className="font-medium">{quotation?.customerPhone || 'N/A'}</p>
              <p className="text-sm text-blue-600">{quotation?.customerEmail || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Business Type</label>
              <p className="font-medium">{quotation?.customer?.businessDetails?.businessType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">GST Number</label>
              <p className="font-medium">{quotation?.customer?.businessDetails?.gstNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Business Address</label>
              <p className="font-medium">{quotation?.customer?.businessDetails?.businessAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-lg">Product Information</h3>
          </div>
          <div className="space-y-4">
            {quotation?.product?.images?.[0] && (
              <img 
                src={quotation.product.images[0]} 
                alt={quotation.productName}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div>
              <label className="text-sm text-gray-500">Product Name</label>
              <p className="font-medium">{quotation?.productName || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Base Price</label>
                <p className="font-medium">₹{quotation?.product?.price?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Quantity</label>
                <p className="font-medium">{quotation?.quantity || 0} units</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Stock Status</label>
              <p className={`font-medium ${
                quotation?.product?.stockStatus === 'in_stock' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {quotation?.product?.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Additional Specifications</h3>
            </div>
            <p className="whitespace-pre-wrap text-gray-600">{quotation.specifications || 'No additional specifications provided.'}</p>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Actions</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.open(`https://wa.me/${quotation.customerPhone}`, '_blank')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Contact via WhatsApp
                </Button>
                <Button 
                  onClick={() => window.location.href = `mailto:${quotation.customerEmail}`}
                  className="flex-1"
                  variant="outline"
                >
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;