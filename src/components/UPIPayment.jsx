import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UPIPayment = ({ orderId, amount }) => {
    const [paymentData, setPaymentData] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [error, setError] = useState(null);
    const [customerUpiId, setCustomerUpiId] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [verificationAttempts, setVerificationAttempts] = useState(0);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const MAX_VERIFICATION_ATTEMPTS = 3;
    const VERIFICATION_INTERVAL = 5000; // 5 seconds

    useEffect(() => {
        generatePayment();
        return () => clearTimeout(verificationTimer.current);
    }, [orderId]);

    const verificationTimer = useRef(null);

    const generatePayment = async () => {
        try {
            setError(null);
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://ambika-api.onrender.com/api';
            const response = await fetch(`${apiUrl}/upi-payments/generate/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setPaymentData(data.data);
            // Start auto-verification after payment is generated
            startAutoVerification();
        } catch (err) {
            setError(err.message);
        }
    };

    const startAutoVerification = useCallback(() => {
        if (verificationStatus === 'completed') {
            return;
        }

        if (verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
            // Show manual verification option
            return;
        }

        // Clear any existing timer
        if (verificationTimer.current) {
            clearTimeout(verificationTimer.current);
        }

        verificationTimer.current = setTimeout(async () => {
            try {
                const success = await verifyPayment();
                if (!success && verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
                    setVerificationAttempts(prev => prev + 1);
                    // Increase interval time with each attempt
                    setTimeout(() => {
                        startAutoVerification();
                    }, VERIFICATION_INTERVAL * (verificationAttempts + 1));
                }
            } catch (err) {
                console.error('Auto-verification failed:', err);
                if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
                    setVerificationAttempts(prev => prev + 1);
                    setTimeout(() => {
                        startAutoVerification();
                    }, VERIFICATION_INTERVAL * (verificationAttempts + 1));
                }
            }
        }, VERIFICATION_INTERVAL);
    }, [verificationStatus, verificationAttempts]);

    const verifyPayment = async (manualUpiTxnId = null) => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://ambika-api.onrender.com/api';
            const response = await fetch(`${apiUrl}/upi-payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId,
                    transactionId: paymentData.transactionId,
                    upiTransactionId: manualUpiTxnId || transactionId,
                    upiId: customerUpiId
                })
            });

            const data = await response.json();

            if (data.success) {
                setVerificationStatus('completed');
                navigate(`/order-success?orderId=${orderId}&total=${data.order.amount}&paymentMethod=UPI`, { 
                    state: { 
                        orderId,
                        orderNumber: data.order.orderNumber,
                        transactionId: data.order.payment.transactionId,
                        amount: data.order.amount,
                        paymentMethod: 'UPI',
                        paidAt: data.order.payment.paidAt
                    }
                });
            } else {
                if (!manualUpiTxnId) {
                    // Don't show error for auto-verification attempts
                    return false;
                }
                setVerificationStatus('failed');
                setError(data.message || 'Payment verification failed. Please try again.');
            }
            return data.success;
        } catch (err) {
            if (!manualUpiTxnId) {
                return false;
            }
            setVerificationStatus('failed');
            setError(err.message);
            return false;
        }
    };

    const handleUpiIdPayment = async () => {
        if (!customerUpiId) {
            setError('Please enter your UPI ID');
            return;
        }

        try {
            // Create UPI collect request
            const upiUrl = `upi://collect?pa=${customerUpiId}&pn=${encodeURIComponent(paymentData.merchantName)}&am=${amount}&tn=${encodeURIComponent(`Order ${orderId}`)}&tr=${paymentData.transactionId}`;
            
            // For mobile devices
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                window.location.href = upiUrl;
            } else {
                // For desktop: Show QR code for collect request
                const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://ambika-api.onrender.com/api';
                const qrCode = await fetch(`${apiUrl}/upi-payments/collect-qr`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        upiId: customerUpiId,
                        amount,
                        orderId,
                        transactionId: paymentData.transactionId
                    })
                }).then(res => res.json());

                if (qrCode.success) {
                    setPaymentData(prev => ({
                        ...prev,
                        qrCode: qrCode.data.qrCode
                    }));
                }
            }
            
            // Start verification process
            setVerificationAttempts(0);
            startAutoVerification();
        } catch (err) {
            setError('Failed to initiate UPI payment. Please try again.');
        }
    };

    if (error) {
        return (
            <div className="p-4 text-center">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <button
                    onClick={generatePayment}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Retry Payment
                </button>
            </div>
        );
    }

    if (!paymentData) {
        return <div className="p-4 text-center">Loading payment details...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-center">UPI Payment</h2>
                
                <div className="mb-6 text-center">
                    <p className="text-gray-600 mb-2">Amount to Pay:</p>
                    <p className="text-2xl font-bold">₹{amount}</p>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                    <div className="flex justify-center gap-4 mb-4">
                        <button 
                            className={`px-4 py-2 rounded-full ${!customerUpiId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setCustomerUpiId('')}
                        >
                            Scan QR
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-full ${customerUpiId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setCustomerUpiId(' ')}
                        >
                            Enter UPI ID
                        </button>
                    </div>

                    {/* QR Code Section */}
                    {!customerUpiId && (
                        <div className="text-center">
                            <p className="text-gray-600 mb-2">Scan QR Code to Pay</p>
                            <img
                                src={paymentData.qrCode}
                                alt="UPI Payment QR Code"
                                className="mx-auto max-w-[200px] mb-4"
                            />
                            <p className="text-sm text-gray-500">After payment, please wait while we verify automatically</p>
                        </div>
                    )}

                    {/* UPI ID Input Section */}
                    {customerUpiId !== '' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your UPI ID</label>
                                <input
                                    type="text"
                                    value={customerUpiId}
                                    onChange={(e) => setCustomerUpiId(e.target.value)}
                                    placeholder="yourname@upi"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button
                                onClick={handleUpiIdPayment}
                                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                disabled={!customerUpiId}
                            >
                                Pay Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Manual Verification Section */}
                {verificationStatus === 'pending' && verificationAttempts >= MAX_VERIFICATION_ATTEMPTS && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                        <p className="text-sm text-gray-600">If you've made the payment but it's not verified automatically:</p>
                        <input
                            type="text"
                            placeholder="Enter UPI Transaction ID"
                            className="w-full p-2 border rounded"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <button
                            onClick={() => verifyPayment(transactionId)}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            disabled={!transactionId}
                        >
                            Verify Payment
                        </button>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                        {error}
                        <button 
                            onClick={generatePayment}
                            className="ml-2 text-blue-500 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {verificationStatus === 'pending' && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p>Waiting for payment verification...</p>
                        <p className="text-xs text-gray-500 mt-1">
                            This may take a few moments
                        </p>
                    </div>
                )}

                {/* <div className="mt-4 text-sm text-gray-500">
                    <p>Transaction ID: {paymentData.transactionId}</p>
                    <p>Please keep this for your reference</p>
                </div> */}
            </div>
        </div>
    );
};

export default UPIPayment;