import { useState, useEffect } from 'react';
import { ToggleRight, CreditCard, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetSettingsQuery, useUpdatePaymentSettingsMutation } from '../../store/api/settingsApiSlice';

const AdminPayments = () => {
  const { data: settingsResponse, isLoading } = useGetSettingsQuery();
  const settings = settingsResponse?.data || {};

  const [payments, setPayments] = useState({ upi: true, cod: true });
  const [updatePaymentSettings, { isLoading: isSaving }] = useUpdatePaymentSettingsMutation();

  useEffect(() => {
    if (settings && settings.payments) {
      setPayments({
        upi: settings.payments.upi ?? true,
        cod: settings.payments.cod ?? true
      });
    }
  }, [settings]);

  const toggle = (key) => {
    setPayments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await updatePaymentSettings({ payments }).unwrap();
      toast.success('Payment visibility updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update payment settings');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-sm text-neutral-600">Toggle which payment methods appear on the public website</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet size={20} className="text-neutral-600" />
            <div>
              <p className="font-medium">UPI</p>
              <p className="text-sm text-neutral-500">Show UPI payment option on checkout</p>
            </div>
          </div>
          <button onClick={() => toggle('upi')} className={`p-2 rounded-lg ${payments.upi ? 'bg-green-50' : 'bg-neutral-50'}`}>
            <ToggleRight size={24} className={`${payments.upi ? 'text-green-600' : 'text-neutral-400'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-neutral-600" />
            <div>
              <p className="font-medium">Cash On Delivery (COD)</p>
              <p className="text-sm text-neutral-500">Show COD option on checkout</p>
            </div>
          </div>
          <button onClick={() => toggle('cod')} className={`p-2 rounded-lg ${payments.cod ? 'bg-green-50' : 'bg-neutral-50'}`}>
            <ToggleRight size={24} className={`${payments.cod ? 'text-green-600' : 'text-neutral-400'}`} />
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
