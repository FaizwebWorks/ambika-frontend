import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCheckUPIStatusMutation, useGenerateUPIPaymentMutation, useVerifyUPIPaymentMutation } from '../store/api/upiPaymentApiSlice';
import { toast } from 'react-hot-toast';


const UPIPayment = ({ orderId, amount }) => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [generateUpiPayment] = useGenerateUPIPaymentMutation();
    const [checkUpiStatus] = useCheckUPIStatusMutation();
    const [verifyUpiPayment] = useVerifyUPIPaymentMutation();

    const [paymentData, setPaymentData] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [error, setError] = useState(null);
    const [customerUpiId, setCustomerUpiId] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [verificationAttempts, setVerificationAttempts] = useState(0);
    
    const MAX_VERIFICATION_ATTEMPTS = 10;
    const VERIFICATION_INTERVAL = 5000; // 5 seconds

    useEffect(() => {
        if (orderId && amount) {
            console.log('Initializing payment with orderId:', orderId, 'amount:', amount);
            generatePayment();
        } else {
            console.log('Missing orderId or amount', { orderId, amount });
        }
        return () => clearTimeout(verificationTimer.current);
    }, [orderId, amount]);

    const verificationTimer = useRef(null);


    const generatePayment = async () => {
        try {
            if (!orderId || !amount) {
                console.error('Missing required parameters:', { orderId, amount });
                setError('Missing order details. Please try again.');
                return;
            }

            setError(null);
            setVerificationStatus('pending');
            setVerificationAttempts(0);
            
            // Clear any existing verification timer
            if (verificationTimer.current) {
                clearTimeout(verificationTimer.current);
            }

            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://ambika-api.onrender.com/api';
            console.log('Generating payment for order:', orderId, 'amount:', amount);
            
            const response = await generateUpiPayment(orderId).unwrap();
            console.log('Payment generation response:', response);

            setPaymentData(response);
            
            // Don't start verification immediately, wait for user to make payment
            if (!customerUpiId) {
                // For QR code display, wait for a bit before starting verification
                setTimeout(() => {
                    console.log('Starting verification for QR payment...');
                    setVerificationAttempts(0);
                    startAutoVerification();
                }, 10000); // Give user 10 seconds to scan and pay
            }
        } catch (err) {
            setError(err.message);
        }
    };

    
    const startAutoVerification = useCallback(async () => {
        if (verificationStatus === 'completed') {
            console.log('Payment already verified');
            return;
        }

        if (verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
            console.log('Max verification attempts reached');
            return;
        }

        // Clear any existing timer
        if (verificationTimer.current) {
            clearTimeout(verificationTimer.current);
        }

        verificationTimer.current = setTimeout(async () => {
            try {
                if (!paymentData || !orderId || !amount) {
                    console.log('Missing required data:', { 
                        hasPaymentData: !!paymentData, 
                        hasOrderId: !!orderId, 
                        hasAmount: !!amount 
                    });
                    return;
                }

                console.log(`Starting verification attempt ${verificationAttempts + 1}/${MAX_VERIFICATION_ATTEMPTS}`);
                console.log('Payment data:', paymentData);

                // First check UPI status
                const statusResult = await checkUpiStatus({
                    orderId,
                    transactionId: paymentData.transactionId,
                    amount: amount
                }).unwrap();

                console.log('Payment status:', statusResult);

                console.log('Status check result:', statusResult);
                
                if (statusResult.status === 'SUCCESS' || statusResult.status === 'COMPLETED') {
                    console.log('Payment marked as successful, verifying...');
                    try {
                        // Verify the payment
                        const verificationData = {
                            orderId,
                            transactionId: paymentData.transactionId,
                            amount: amount
                        };
                        
                        const verificationResult = await verifyUpiPayment(verificationData).unwrap();
                        console.log('Verification result:', verificationResult);

                        if (verificationResult.success) {
                            console.log('Payment verified successfully!');
                            setVerificationStatus('completed');
                            toast.success('Payment successful!');
                            
                            // Navigate to success page
                            navigate(`/order-success?orderId=${orderId}&total=${amount}&paymentMethod=UPI`, { 
                                state: { 
                                    orderId,
                                    transactionId: paymentData.transactionId,
                                    amount: amount,
                                    paymentMethod: 'UPI',
                                    paidAt: new Date().toISOString()
                                },
                                replace: true
                            });
                            return;
                        }
                    } catch (verifyErr) {
                        console.error('Verification error:', verifyErr);
                    }
                } else {
                    console.log('Payment status:', statusResult.status);
                }

                // Schedule next verification attempt
                if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
                    setVerificationAttempts(prev => prev + 1);
                    const nextInterval = VERIFICATION_INTERVAL;
                    console.log(`Scheduling next verification in ${nextInterval/1000} seconds...`);
                    startAutoVerification();
                } else {
                    console.log('Max verification attempts reached');
                    setError('Payment verification timed out. Please enter your UPI transaction ID below to verify manually.');
                }
            } catch (err) {
                console.error('Auto-verification failed:', err);
                
                // On error, retry with increased interval
                const nextInterval = VERIFICATION_INTERVAL * Math.pow(1.5, verificationAttempts);
                if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
                    setVerificationAttempts(prev => prev + 1);
                    setTimeout(startAutoVerification, nextInterval);
                }
            }
        }, VERIFICATION_INTERVAL);
    }, [verificationStatus, verificationAttempts, orderId, amount, paymentData]);

    const verifyPayment = async (manualUpiTxnId = null) => {
        try {
            if (!paymentData) {
                throw new Error('Payment data is missing');
            }

            const verificationData = {
                orderId,
                transactionId: paymentData.transactionId,
                amount: amount,
                upiTransactionId: manualUpiTxnId || paymentData.transactionId
            };

            console.log('Verifying payment:', verificationData);
            
            // First check status
            const statusResult = await checkUpiStatus({
                orderId,
                transactionId: paymentData.transactionId
            }).unwrap();

            console.log('Payment status result:', statusResult);

            if (statusResult.status === 'SUCCESS') {
                // Verify the payment if status is success
                const result = await verifyUpiPayment(verificationData).unwrap();
                console.log('Verification result:', result);

                if (result.success) {
                    clearTimeout(verificationTimer.current);
                    setVerificationStatus('completed');
                    toast.success('Payment verified successfully!');
                    
                    // Navigate to success page
                    const successPath = `/order-success?orderId=${orderId}&total=${amount}&paymentMethod=UPI`;
                    console.log('Navigating to:', successPath);
                    
                    navigate(successPath, { 
                        state: { 
                            orderId,
                            transactionId: paymentData.transactionId,
                            amount: amount,
                            paymentMethod: 'UPI',
                            paidAt: new Date().toISOString()
                        },
                        replace: true // Use replace to prevent going back to payment page
                    });
                    return true;
                }
            }

            // If manual verification and failed
            if (manualUpiTxnId) {
                setVerificationStatus('failed');
                setError('Payment verification failed. Please check your UPI transaction ID and try again.');
            }
            return false;
        } catch (err) {
            console.error('Verification error:', err);
            if (!manualUpiTxnId) {
                return false;
            }
            setVerificationStatus('failed');
            setError('Payment verification failed. Please try again later.');
            return false;
        }
    };

    const handleUpiIdPayment = async () => {
        if (!customerUpiId.trim()) {
            setError('Please enter your UPI ID');
            return;
        }

        try {
            setError(null);
            
            if (!paymentData || !paymentData.transactionId) {
                throw new Error('Payment details not available. Please try again.');
            }

            // For mobile devices
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // Generate UPI URL
                const upiUrl = `upi://pay?pa=${paymentData.merchantUPI}&pn=${encodeURIComponent(paymentData.merchantName)}&am=${amount}&tn=${encodeURIComponent(`Order ${orderId}`)}&tr=${paymentData.transactionId}`;
                window.location.href = upiUrl;
            } else {
                // For desktop: Show QR code
                const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://ambika-api.onrender.com/api';
                const response = await fetch(`${apiUrl}/upi-payments/qr`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount,
                        orderId,
                        transactionId: paymentData.transactionId
                    })
                });
                
                const qrCode = await response.json();

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
                    <p className="text-xs text-gray-500 mt-1">(Includes 1% service fee)</p>
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
                                    value={customerUpiId.trim()}
                                    onChange={(e) => setCustomerUpiId(e.target.value)}
                                    placeholder="yourname@upi"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button
                                onClick={handleUpiIdPayment}
                                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                disabled={!customerUpiId.trim()}
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