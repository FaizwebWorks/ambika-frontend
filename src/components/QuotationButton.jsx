import { FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateQuotationRequestMutation } from '../store/api/quotationApiSlice';

const QuotationButton = ({ product, quantity = 1 }) => {
  const [createQuotation, { isLoading }] = useCreateQuotationRequestMutation();

  const handleQuotationRequest = async () => {
    try {
      await createQuotation({
        productId: product._id,
        quantity,
        notes: `Quotation request for ${product.title}`
      }).unwrap();

      toast.success(
        <div className="space-y-2">
          <h3 className="font-medium">Quotation Request Sent!</h3>
          <p className="text-sm text-neutral-600">
            We'll send the quotation details to your registered email shortly.
          </p>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error('Failed to send quotation request. Please try again.');
    }
  };

  return (
    <button
      onClick={handleQuotationRequest}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
    >
      <div className="flex items-center justify-center gap-2">
        <FileText size={20} />
        <span>{isLoading ? 'Sending Request...' : 'Request Quotation'}</span>
      </div>
      <div className="text-xs mt-1">Get bulk pricing & special offers</div>
    </button>
  );
};

export default QuotationButton;