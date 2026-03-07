import { Brain } from 'lucide-react';

const steps = [
    'Gathering market intelligence...',
    'Analyzing competitors...',
    'Profiling target users...',
    'Building SWOT matrix...',
    'Evaluating monetization models...',
    'Designing technical architecture...',
    'Computing viability score...',
];

export default function LoadingAnimation() {
    return (
        <div className="glass-card p-12 text-center animate-fade-in">
            {/* Central spinner */}
            <div className="relative w-24 h-24 mx-auto mb-8">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
                <div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400 border-r-brand-400 animate-spin"
                    style={{ animationDuration: '1s' }}
                />
                {/* Inner ring */}
                <div
                    className="absolute inset-3 rounded-full border-2 border-transparent border-b-purple-400 border-l-purple-400 animate-spin"
                    style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
                />
                {/* Core icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain size={28} className="text-brand-400 animate-pulse" />
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">AI Analysis in Progress</h3>
            <p className="text-gray-400 text-sm mb-8">
                Gemini is analyzing your startup idea across multiple dimensions
            </p>

            {/* Animated steps */}
            <div className="space-y-2 text-left max-w-xs mx-auto">
                {steps.map((step, i) => (
                    <div
                        key={step}
                        className="flex items-center gap-3 text-sm text-gray-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
                    >
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 dot-1" />
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 dot-2" />
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 dot-3" />
                        </div>
                        {step}
                    </div>
                ))}
            </div>
        </div>
    );
}
