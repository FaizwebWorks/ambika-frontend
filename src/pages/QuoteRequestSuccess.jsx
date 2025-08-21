import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Package, Clock, User, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';

const QuoteRequestSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('productName') || 'Product';
  const quantity = searchParams.get('quantity') || '1';
  const quoteId = searchParams.get('quoteId') || 'QR' + Date.now();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Quote Request Submitted!
          </h1>
          <p className="text-neutral-600">
            Your quote request has been successfully submitted to our team.
          </p>
        </div>

        {/* Quote Details */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <FileText size={18} />
            Quote Details
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Quote ID:</span>
              <span className="font-medium text-blue-600">{quoteId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Product:</span>
              <span className="font-medium text-right max-w-xs truncate">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Quantity:</span>
              <span className="font-medium">{quantity} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status:</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                <Clock size={12} />
                Under Review
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <User size={18} />
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              Our sales team will review your quote request within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              You'll receive a detailed quote via email with pricing and terms
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              Our team will contact you to discuss any customization needs
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              Track your quote status in your profile dashboard
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/profile')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Package size={20} className="mr-2" />
            View My Quotes
          </Button>
          
          <Button 
            onClick={() => navigate('/categories')}
            variant="outline"
            className="w-full h-12 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-6 p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm text-neutral-600 mb-2">
            Need immediate assistance?
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="tel:+911234567890" className="text-blue-600 hover:text-blue-700">
              📞 Call Us
            </a>
            <a href="mailto:sales@ambika.com" className="text-blue-600 hover:text-blue-700">
              ✉️ Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestSuccess;
