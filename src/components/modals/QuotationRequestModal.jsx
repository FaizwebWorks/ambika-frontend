import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCreateQuotationRequestMutation } from '../../store/api/quotationApiSlice';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';

export default function QuotationRequestModal({ 
  isOpen, 
  onClose, 
  product,
}) {
  const [quantity, setQuantity] = useState(1);
  const [specifications, setSpecifications] = useState('');
  const [createQuotation, { isLoading }] = useCreateQuotationRequestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuotation({
        productId: product._id,
        quantity,
        specifications,
      }).unwrap();
      
      toast.success('Quotation request sent successfully');
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send quotation request');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Request Quotation</h2>
        
        <div className="mb-4">
          <h3 className="font-medium text-neutral-900">{product?.title}</h3>
          <p className="text-sm text-neutral-600">Fill in the details to request a quotation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Quantity Required
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border border-neutral-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Additional Specifications (Optional)
            </label>
            <textarea
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              rows={3}
              className="w-full p-2 border border-neutral-300 rounded-lg"
              placeholder="Any specific requirements or details..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Sending...' : 'Request Quotation'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}