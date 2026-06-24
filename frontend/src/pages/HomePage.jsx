import { useState, useEffect } from 'react';
import IdeaInputForm from '../components/IdeaInputForm';
import PulseLoader from '../components/PulseLoader';
import AnalysisResults from '../components/AnalysisResults';
import ParticleBackground from '../components/ParticleBackground';
import { analyzeIdea } from '../services/api';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    // Simulate progress during analysis
    useEffect(() => {
        let interval;
        if (isLoading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 95) return 95;
                    return p + Math.floor(Math.random() * 10) + 5;
                });
            }, 600);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSubmit = async (idea, description) => {
        if (!isAuthenticated) {
            console.log("Guest validation click intercepted - opening login modal");
            setIsLoginModalOpen(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        // Debug logging for request configuration
        const targetUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analyze`;
        console.log(`[API Request Initiated] URL: ${targetUrl}`, { idea, description });

        try {
            const result = await analyzeIdea(idea, description);
            console.log("[API Request Succeeded] Response data:", result);
            setProgress(100);
            setTimeout(() => {
                setAnalysis(result);
                setIsLoading(false);
            }, 800);
        } catch (err) {
            console.error("[API Request Failed] Error Details:", {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                responseData: err.response?.data,
                requestConfig: {
                    url: err.config?.url,
                    method: err.config?.method,
                    headers: err.config?.headers,
                }
            });
            const msg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
            setError(msg);
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setAnalysis(null);
        setError(null);
        setProgress(0);
    };

    return (
        <div className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden flex flex-col z-0">
            <ParticleBackground isAnalyzing={isLoading} />

            <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow relative z-10 flex flex-col">
                {/* Hero */}
                {!analysis && !isLoading && (
                    <div className="text-center mt-12 mb-10 flex flex-col items-center">
                        <h1 className="text-5xl md:text-7xl font-black text-borderDark uppercase tracking-tighter mb-4"
                            style={{ WebkitTextStroke: '2px #000', color: '#F5F5F5' }}>
                            Validate Your<br />
                            <span className="text-brandPrimary" style={{ WebkitTextStroke: '2px #000' }}>Startup</span>
                        </h1>
                        <p className="text-xl font-mono text-borderDark font-bold border-4 border-borderDark inline-block px-4 py-2 bg-[#10B981] shadow-brutal transform -rotate-1 mb-10">
                            brutal honesty for visionary founders
                        </p>
                        <div className="w-full max-w-2xl bg-white border-4 border-borderDark shadow-brutal p-8">
                            <IdeaInputForm onSubmit={handleSubmit} isLoading={isLoading} />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="brutal-card bg-red-50 p-6 mb-6 flex flex-col items-center gap-3 text-center max-w-lg mx-auto">
                        <AlertCircle size={48} className="text-red-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-black text-red-900 uppercase">Validation Failed</h3>
                            <p className="text-red-800 font-mono mt-2 font-bold">{error}</p>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <PulseLoader progress={progress} />
                    </div>
                )}

                {analysis && !isLoading && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-10 border-b-4 border-borderDark pb-6">
                            <div>
                                <p className="text-sm font-mono font-bold text-gray-500 mb-1 uppercase tracking-widest">Validating:</p>
                                <h2 className="text-3xl font-black text-borderDark">{analysis.idea_text || 'Your Idea'}</h2>
                            </div>
                            <button onClick={handleReset} className="btn-primary !px-6 !py-3 flex items-center gap-2">
                                <RotateCcw size={18} strokeWidth={3} />
                                Restart
                            </button>
                        </div>
                        <AnalysisResults analysis={analysis} />
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}
