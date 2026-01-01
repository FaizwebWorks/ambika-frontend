import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const success = params.get('success');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-neutral-100 via-blue-50 to-neutral-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={`flex-shrink-0 rounded-full p-4 ${success === 'true' ? 'bg-green-50' : 'bg-red-50'}`}>
            {success === 'true' ? (
              <CheckCircle className="text-green-600" size={48} />
            ) : (
              <XCircle className="text-red-600" size={48} />
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {success === 'true' ? (
              <>
                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">Email Verified</h2>
                <p className="mt-2 text-neutral-600">Thanks — your email has been verified. Your account is now active and you can sign in.</p>

                <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    Continue to site
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">Verification Link Expired</h2>
                <p className="mt-2 text-neutral-600">The verification link is invalid or has expired. You need a new verification link to activate your account.</p>

                <ul className="mt-4 text-sm text-neutral-600 space-y-2">
                  <li>• Check your spam/junk folder in case the email was filtered.</li>
                  <li>• If you didn't receive an email, request a new verification link below.</li>
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
                  >
                    Register Again
                  </button>

                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Request New Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
