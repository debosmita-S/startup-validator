import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestOTP, verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1 = identifier, 2 = otp
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setStep(1);
        setIdentifier('');
        setOtp('');
        setError('');
        onClose();
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        if (!identifier.trim()) {
            setError('Please enter an email or phone number.');
            return;
        }

        setLoading(true);
        try {
            await requestOTP(identifier);
            setStep(2);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to request OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        if (!otp.trim()) {
            setError('Please enter the OTP.');
            return;
        }

        setLoading(true);
        try {
            const data = await verifyOTP(identifier, otp);
            login(data.access_token);
            handleClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="brutal-card w-full max-w-md bg-bgBase p-8 relative"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 border-2 border-transparent hover:border-borderDark hover:bg-white transition-colors"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>

                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                            {step === 1 ? 'Login / Sign Up' : 'Verify OTP'}
                        </h2>

                        <p className="font-mono text-sm font-bold text-gray-500 mb-6">
                            {step === 1
                                ? 'Access your saved analysis history.'
                                : `Enter the 6-digit code sent to ${identifier} (check backend terminal).`}
                        </p>

                        {error && (
                            <div className="bg-brandPrimary/10 border-2 border-brandPrimary p-3 mb-6 flex items-start gap-2">
                                <AlertCircle className="text-brandPrimary shrink-0 mt-0.5" size={18} strokeWidth={3} />
                                <p className="font-mono text-sm font-bold leading-tight text-brandPrimary">{error}</p>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleRequestOTP} className="space-y-6">
                                <div>
                                    <label className="block font-black uppercase tracking-tight text-sm mb-2">
                                        Email or Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="founder@startup.com"
                                        className="input-brutal w-full text-lg"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div>
                                    <label className="block font-black uppercase tracking-tight text-sm mb-2">
                                        6-Digit Code
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        className="input-brutal w-full text-center text-3xl tracking-[0.5em] font-mono"
                                        autoFocus
                                        maxLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                                    ) : (
                                        'Verify & Login'
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="font-mono text-sm font-bold text-gray-500 hover:text-borderDark underline decoration-2 underline-offset-4"
                                    >
                                        Change contact method
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
