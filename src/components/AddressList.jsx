import { Building, Edit2, Home, MapPin, MapPinIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AddressModal from './AddressModal';
import { Button } from './ui/button';

const AddressList = ({
  addresses = [],
  selectedAddressId,
  onAddressSelect,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
  isLoading = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Home size={16} className="text-blue-600" />;
      case 'Office':
        return <Building size={16} className="text-green-600" />;
      default:
        return <MapPinIcon size={16} className="text-purple-600" />;
    }
  };

  const getAddressDisplayName = (address) => {
    if (address.name === 'Other' && address.customName) {
      return address.customName;
    }
    return address.name;
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleSaveAddress = async (formData) => {
    setOperationLoading(true);
    try {
      if (editingAddress) {
        await onUpdateAddress(editingAddress._id, formData);
        toast.success('Address updated successfully!');
      } else {
        await onAddAddress(formData);
        toast.success('Address added successfully!');
      }
      setShowModal(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await onDeleteAddress(addressId);
        toast.success('Address deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await onSetDefault(addressId);
      toast.success('Default address updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-neutral-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">
          Delivery Addresses
        </h3>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          Add New
        </Button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
          <MapPin size={48} className="mx-auto text-neutral-400 mb-4" />
          <h4 className="text-lg font-medium text-neutral-600 mb-2">
            No addresses saved
          </h4>
          <p className="text-neutral-500 mb-4">
            Add your first delivery address to continue
          </p>
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddressId === address._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => onAddressSelect(address._id)}
            >
              <div className="flex items-start gap-3">
                {/* Address Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getAddressIcon(address.name)}
                </div>

                {/* Address Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-neutral-900">
                      {getAddressDisplayName(address)}
                    </h4>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="font-medium text-neutral-800 mb-1">
                    {address.fullName}
                  </p>
                  <p className="text-sm text-neutral-600 mb-1">
                    {address.phone}
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {address.street}, {address.city}, {address.state} - {address.zipCode}
                    {address.landmark && `, Near ${address.landmark}`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address._id);
                      }}
                      className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Set as default"
                    >
                      <MapPin size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit address"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address._id);
                    }}
                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedAddressId === address._id && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Selected for delivery
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        address={editingAddress}
        isLoading={operationLoading}
      />
    </div>
  );
};

export default AddressList;
