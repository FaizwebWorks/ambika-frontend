import { FileText, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useGetAllQuotationRequestsQuery, useRespondToQuotationMutation } from '../../store/api/quotationApiSlice';

export default function AdminQuotations() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, isLoading, refetch } = useGetAllQuotationRequestsQuery({ page, status: statusFilter });
  const [respondToQuotation] = useRespondToQuotationMutation();
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [responseForm, setResponseForm] = useState({
    status: '',
    unitPrice: '',
    validityDays: 7,
    adminNotes: ''
  });

  const handleResponse = async (id) => {
    try {
      await respondToQuotation({
        id,
        ...responseForm
      }).unwrap();
      
      toast.success('Response sent successfully');
      setSelectedQuotation(null);
      setResponseForm({
        status: '',
        unitPrice: '',
        validityDays: 7,
        adminNotes: ''
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send response');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Quotation Requests</h1>
          <p className="text-neutral-600">Manage quotation requests from B2B customers</p>
        </div>
        
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-neutral-200 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="quoted">Quoted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p>Loading quotation requests...</p>
          </div>
        ) : data?.data?.quotations?.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {data.data.quotations.map((quote) => (
              <div key={quote._id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">{quote.product?.title}</h3>
                    <p className="text-sm text-neutral-600">
                      From: {quote.customer?.name} ({quote.customer?.businessDetails?.companyName})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'quoted' ? 'bg-green-100 text-green-800' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-neutral-100 text-neutral-800'
                    }`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedQuotation(quote)}
                      className="p-1 hover:bg-neutral-100 rounded"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600">Quantity</p>
                    <p className="font-medium">{quote.quantity}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Contact</p>
                    <p className="font-medium">{quote.customer?.phone}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Requested On</p>
                    <p className="font-medium">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedQuotation?._id === quote._id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Status
                        </label>
                        <select
                          value={responseForm.status}
                          onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded-lg"
                        >
                          <option value="">Select Status</option>
                          <option value="quoted">Send Quotation</option>
                          <option value="rejected">Reject Request</option>
                        </select>
                      </div>

                      {responseForm.status === 'quoted' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Unit Price (₹)
                            </label>
                            <input
                              type="number"
                              value={responseForm.unitPrice}
                              onChange={(e) => setResponseForm({ ...responseForm, unitPrice: e.target.value })}
                              className="w-full p-2 border border-neutral-300 rounded-lg"
                              placeholder="Enter unit price"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Validity (Days)
                            </label>
                            <input
                              type="number"
                              value={responseForm.validityDays}
                              onChange={(e) => setResponseForm({ ...responseForm, validityDays: e.target.value })}
                              className="w-full p-2 border border-neutral-300 rounded-lg"
                              placeholder="Enter validity in days"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={responseForm.adminNotes}
                          onChange={(e) => setResponseForm({ ...responseForm, adminNotes: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded-lg"
                          rows={3}
                          placeholder="Add any notes..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResponse(quote._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Send Response
                        </button>
                        <button
                          onClick={() => setSelectedQuotation(null)}
                          className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No quotation requests found</p>
          </div>
        )}

        {data?.data?.pagination?.pages > 1 && (
          <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.data.pagination.total)} of {data.data.pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-neutral-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.data.pagination.pages}
                className="px-3 py-1 border border-neutral-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}