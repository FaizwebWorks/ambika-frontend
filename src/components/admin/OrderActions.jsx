import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, DownloadCloud, ArrowDownCircle, Check } from 'lucide-react';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderActions = ({ order, onStatusChange, isUpdating, onDownload, className = '' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    if (!order) return null;

    return (
        <div className={`relative inline-block text-left ${className}`} ref={ref}>
            <button
                onClick={() => setOpen(s => !s)}
                className="px-3 py-2 border border-neutral-200 rounded-md bg-white hover:bg-neutral-50 text-sm flex items-center gap-2"
                aria-haspopup="menu"
            >
                Actions  <MoreHorizontal size={16} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-md shadow-lg z-50">
                    <div className="py-2">
                        <div className="px-3 py-2 text-xs text-neutral-500">Status</div>
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => { setOpen(false); onStatusChange && onStatusChange(s); }}
                                className={`w-full text-left px-3 py-2 hover:bg-neutral-50 text-sm ${order.status === s ? 'font-semibold' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                                    {order.status === s && <Check size={14} className="text-green-600" />}
                                </div>
                            </button>
                        ))}

                        <div className="border-t border-neutral-100 my-1" />

                        <button
                            onClick={() => { setOpen(false); onDownload && onDownload(); }}
                            className="w-full text-left px-3 py-2 hover:bg-neutral-50 text-sm flex items-center gap-2"
                        >
                            <DownloadCloud size={16} /> Download Invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderActions;
