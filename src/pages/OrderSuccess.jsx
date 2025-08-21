import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowLeft, Home, FileText, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const total = searchParams.get('total');

  useEffect(() => {
    // Auto redirect after 15 seconds
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-neutral-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-blue-600" />
            Order Details
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Order ID:</span>
              <span className="font-mono font-medium text-blue-600">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Total Amount:</span>
              <span className="font-bold text-green-600">₹{total ? parseFloat(total).toLocaleString('en-IN') : '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Payment:</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                <Package size={12} />
                Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Status:</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <Package size={12} />
                Order Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Truck size={18} />
            Delivery Information
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Estimated delivery: <span className="font-medium">{estimatedDelivery.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span></p>
            <p>• You'll receive SMS and email updates on delivery status</p>
            <p>• Our delivery partner will contact you before delivery</p>
            <p>• Please keep the order ID ready for verification</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-3">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Order Processing</p>
                <p className="text-sm text-neutral-600">We'll prepare your order for shipment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Quality Check</p>
                <p className="text-sm text-neutral-600">Each item is carefully inspected</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Shipped</p>
                <p className="text-sm text-neutral-600">Order dispatched with tracking details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs font-bold">4</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Delivered</p>
                <p className="text-sm text-neutral-600">Your order arrives at your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/profile?tab=orders')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText size={20} className="mr-2" />
            Track Your Order
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/categories')}
              variant="outline"
              className="h-12 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <Package size={20} className="mr-2" />
              Shop More
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="h-12 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <Home size={20} className="mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Customer Support */}
        <div className="text-center mt-6 p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm text-neutral-600 mb-3">
            Need help with your order?
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a 
              href="tel:+911234567890" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Phone size={14} />
              Call Support
            </a>
            <a 
              href="mailto:support@ambika.com" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Mail size={14} />
              Email Us
            </a>
          </div>
        </div>

        {/* Auto redirect notice */}
        <div className="text-center mt-4">
          <p className="text-xs text-neutral-500">
            You'll be redirected to your profile in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
