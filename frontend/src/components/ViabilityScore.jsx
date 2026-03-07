import { useEffect, useRef } from 'react';

export default function ViabilityScore({ score }) {
    const circumference = 502; // 2 * PI * 80
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s >= 75) return ['#10b981', '#34d399']; // green
        if (s >= 50) return ['#f59e0b', '#fbbf24']; // amber
        return ['#ef4444', '#f87171'];               // red
    };

    const getLabel = (s) => {
        if (s >= 80) return { text: 'Excellent', color: 'text-emerald-400' };
        if (s >= 65) return { text: 'Strong', color: 'text-emerald-400' };
        if (s >= 50) return { text: 'Moderate', color: 'text-amber-400' };
        if (s >= 35) return { text: 'Risky', color: 'text-orange-400' };
        return { text: 'Weak', color: 'text-red-400' };
    };

    const [colorStart, colorEnd] = getColor(score);
    const label = getLabel(score);
    const gradId = `score-grad-${score}`;

    return (
        <div className="glass-card p-6 text-center animate-slide-up">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Viability Score
            </h3>

            <div className="relative inline-block">
                <svg width="180" height="180" viewBox="0 0 180 180">
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colorStart} />
                            <stop offset="100%" stopColor={colorEnd} />
                        </linearGradient>
                    </defs>
                    {/* Background ring */}
                    <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                    {/* Score arc */}
                    <circle
                        cx="90" cy="90" r="80"
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 90 90)"
                        className="score-circle transition-all duration-1000 ease-out"
                        style={{ '--target-offset': offset }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{score}</span>
                    <span className="text-lg font-bold" style={{ color: colorStart }}>/100</span>
                </div>
            </div>

            <div className={`mt-3 text-lg font-bold ${label.color}`}>{label.text}</div>
            <p className="text-xs text-gray-500 mt-1">Overall startup viability rating</p>
        </div>
    );
}
