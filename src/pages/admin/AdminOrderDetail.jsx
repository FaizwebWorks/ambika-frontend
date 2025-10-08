import { AlertTriangle, ArrowLeft, CheckCircle, ClipboardList, Clock, CreditCard, IndianRupee, MapPin, Package, RefreshCw, Truck, User2, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAdminOrderByIdQuery } from '../../store/api/adminApiSlice';

const statusIcons = {
  delivered: <CheckCircle size={16} className="text-green-600" />,
  shipped: <Truck size={16} className="text-blue-600" />,
  processing: <Package size={16} className="text-yellow-600" />,
  pending: <Clock size={16} className="text-orange-600" />,
  cancelled: <XCircle size={16} className="text-red-600" />,
  default: <AlertTriangle size={16} className="text-neutral-500" />
};

const paymentStatusColors = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700'
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);
const formatDate = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const Section = ({ icon, title, children, className='' }) => (
  <div className={`p-4 rounded-lg border bg-white ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
    </div>
    {children}
  </div>
);

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetAdminOrderByIdQuery(id);
  const order = data?.data?.order;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-neutral-100 border border-neutral-200">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Order Details</h1>
            <p className="text-neutral-600 mt-1">Full information for order #{order?.orderNumber || id?.slice(-8)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-sm">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white border rounded-lg p-12 flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-neutral-600">Loading order details...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Failed to load order. {error.data?.message || ''}</p>
            <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Retry</button>
        </div>
      )}

      {order && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-12 xl:col-span-8 space-y-6">
            <Section icon={statusIcons[order.status] || statusIcons.default} title={`Status: ${order.status}`}> 
              <div className="flex flex-wrap gap-3 items-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.payment?.status || 'pending']}`}>{order.payment?.status || 'pending'}</span>
                <span className="text-neutral-500">Placed: {formatDate(order.createdAt)}</span>
                {order.shipping?.shippedAt && <span className="text-neutral-500">Shipped: {formatDate(order.shipping.shippedAt)}</span>}
                {order.shipping?.deliveredAt && <span className="text-neutral-500">Delivered: {formatDate(order.shipping.deliveredAt)}</span>}
              </div>
            </Section>

            <Section icon={<ClipboardList size={16} className="text-neutral-500" />} title={`Items (${order.items.length})`}>
              <div className="space-y-4">
                {order.items.map(it => (
                  <div key={it._id} className="flex gap-4">
                    {it.productInfo?.image && <img src={it.productInfo.image} className="w-16 h-16 object-cover rounded border" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-neutral-900 text-sm truncate">{it.productInfo?.title || it.product?.title || 'Product'}</div>
                      <div className="text-xs text-neutral-500 flex flex-wrap gap-2 mt-1">
                        <span>Qty: {it.quantity}</span>
                        {it.size && <span>Size: {it.size}</span>}
                        {it.variants?.map(v => <span key={v.name}>{v.name}:{v.value}</span>)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-neutral-800 whitespace-nowrap">{formatCurrency(it.price * it.quantity)}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={<Clock size={16} className="text-neutral-500" />} title="Status History">
              <ol className="space-y-2 text-xs">
                {order.statusHistory.slice().reverse().map(h => (
                  <li key={h._id || h.updatedAt} className="flex gap-2 items-center">
                    <span className="w-20 capitalize font-medium">{h.status}</span>
                    <span className="text-neutral-500">{formatDate(h.updatedAt)}</span>
                    {h.note && <span className="text-neutral-400 italic truncate">{h.note}</span>}
                  </li>
                ))}
                {order.statusHistory.length === 0 && <li className="text-neutral-400 italic">No history</li>}
              </ol>
            </Section>

            {order.notes && (
              <Section icon={<AlertTriangle size={16} className="text-neutral-500" />} title="Customer Notes">
                <p className="text-sm whitespace-pre-line text-neutral-700">{order.notes}</p>
              </Section>
            )}
            {order.adminNotes && (
              <Section icon={<AlertTriangle size={16} className="text-neutral-500" />} title="Admin Notes">
                <p className="text-sm whitespace-pre-line text-neutral-700">{order.adminNotes}</p>
              </Section>
            )}
          </div>

          {/* Right column */}
          <div className="col-span-12 xl:col-span-4 space-y-6">
            <Section icon={<User2 size={16} className="text-neutral-500" />} title="Customer">
              <div className="space-y-1 text-sm">
                <div className="font-medium">{order.customerInfo?.name}</div>
                <div className="text-neutral-600">{order.customerInfo?.email}</div>
                <div className="text-neutral-600">{order.customerInfo?.phone}</div>
                {order.customerInfo?.company && <div className="text-neutral-600">{order.customerInfo.company}</div>}
              </div>
            </Section>
            <Section icon={<MapPin size={16} className="text-neutral-500" />} title="Shipping">
              <div className="text-sm text-neutral-700 whitespace-pre-line">
                {order.shipping?.address || order.customerInfo?.address || 'No address'}
              </div>
              <div className="mt-2 space-y-1 text-xs text-neutral-500">
                {order.shipping?.method && <div>Method: {order.shipping.method}</div>}
                {order.shipping?.trackingNumber && <div>Tracking: {order.shipping.trackingNumber}</div>}
                {order.shipping?.estimatedDelivery && <div>ETA: {formatDate(order.shipping.estimatedDelivery)}</div>}
              </div>
            </Section>
            <Section icon={<CreditCard size={16} className="text-neutral-500" />} title="Payment">
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="capitalize">{order.payment?.method}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${paymentStatusColors[order.payment?.status || 'pending']}`}>{order.payment?.status || 'pending'}</span>
              </div>
              {order.payment?.transactionId && <div className="text-xs text-neutral-500 mt-1">Txn: {order.payment.transactionId}</div>}
            </Section>
            <Section icon={<IndianRupee size={16} className="text-neutral-500" />} title="Pricing Breakdown">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatCurrency(order.pricing?.subtotal)}</span></div>
                {/* GST Removed / forced to 0 */}
                <div className="flex justify-between"><span className="text-neutral-500 line-through">Tax</span><span>{formatCurrency(0)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>{formatCurrency(order.pricing?.shipping)}</span></div>
                {order.pricing?.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatCurrency(order.pricing.discount)}</span></div>}
                <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>{formatCurrency(order.pricing?.total)}</span></div>
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetail;
