import { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePivot } from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PivotMe({ viabilityScore, originalIdea }) {
    const [pivoted, setPivoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [strategies, setStrategies] = useState([]);
    const [error, setError] = useState(null);

    // Only show if score is strictly below 60
    if (viabilityScore >= 60 && !pivoted) return null;

    const handlePivot = async () => {
        setPivoted(true);
        setLoading(true);
        setError(null);

        try {
            const data = await generatePivot(originalIdea, viabilityScore);
            setStrategies(data.strategies || []);

            // Trigger confetti only on success
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FF4500', '#000000', '#4CAF50', '#FFD700'],
            });
        } catch (err) {
            console.error(err);
            setError("Failed to generate pivot strategies. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!pivoted) {
        return (
            <div className="mt-8 text-center animate-slide-up">
                <button
                    onClick={handlePivot}
                    className="w-full md:w-auto px-12 py-6 font-black text-2xl text-white bg-brandPrimary border-4 border-borderDark shadow-brutal hover:-translate-y-2 hover:shadow-brutal-lg transition-all duration-300 uppercase tracking-widest"
                >
                    PIVOT ME
                </button>
                <p className="mt-4 font-mono text-sm text-gray-500 font-bold">
                    Score too low? Click to generate 3 AI-powered pivot strategies.
                </p>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-6"
            >
                <div className="flex items-center gap-4 border-b-4 border-borderDark pb-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">
                        Pivot Strategies
                    </h3>
                    {loading && <Loader2 size={24} className="animate-spin text-brandPrimary" strokeWidth={3} />}
                </div>

                {error && (
                    <div className="brutal-card bg-red-100 p-4 flex items-center gap-3">
                        <AlertCircle size={24} className="text-red-500 flex-shrink-0" strokeWidth={3} />
                        <p className="text-red-900 font-mono font-bold text-sm">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {strategies.map((path, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.15 }}
                            className="brutal-card p-6 bg-[#FEF08A] flex flex-col"
                        >
                            <h4 className="text-xl font-black uppercase mb-4 text-borderDark pb-2 border-b-2 border-borderDark/20">{path.title}</h4>
                            <p className="text-sm font-mono font-bold leading-relaxed text-gray-800 flex-grow">{path.description}</p>
                        </motion.div>
                    ))}
                </div>

                {!loading && strategies.length > 0 && (
                    <div className="text-center pt-8">
                        <p className="font-mono text-sm font-bold text-gray-500 uppercase">
                            Which path will you choose?
                        </p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
