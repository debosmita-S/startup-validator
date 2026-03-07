import { motion } from 'framer-motion';
import { useState } from 'react';
import TextScramble from './TextScramble';
import PivotMe from './PivotMe';

// Quick 3D tilt effect variants
const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
    hover: { scale: 1.02, rotateX: 2, rotateY: -2, transition: { type: 'spring', stiffness: 400, damping: 10 } }
};

export default function AnalysisResults({ analysis }) {
    const { analysis_results: result, viability_score = 0 } = analysis;

    // Use the score directly from the top level record if available, else from result. 
    // Wait, the API returns the score at `analysis.viability_score`
    const finalScore = viability_score || result.viability_score || 0;

    return (
        <div className="w-full">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.15 } }
                }}
            >
                {/* MARKET SCORE BENTO TILE */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="brutal-card p-6 md:col-span-1 md:row-span-1 bg-yellow-100 flex flex-col justify-center items-center text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-brandPrimary"></div>
                    <h3 className="text-sm font-mono font-bold uppercase mb-2">Market Score</h3>
                    <div className="text-7xl font-black text-borderDark tracking-tighter" style={{ WebkitTextStroke: '2px #000', color: finalScore >= 70 ? '#10B981' : finalScore >= 50 ? '#F59E0B' : '#EF4444' }}>
                        {finalScore}
                    </div>
                </motion.div>

                {/* COMPETITORS BENTO TILE */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="brutal-card p-6 md:col-span-2 md:row-span-1 bg-[#F5F5F5] relative"
                >
                    <div className="absolute -top-4 -right-4 text-7xl transform rotate-12 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        🦈
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-borderDark inline-block pb-1">
                        <TextScramble text="Competitor Analysis" />
                    </h3>
                    <p className="font-mono text-sm leading-relaxed max-w-prose font-semibold">
                        {result.competitors}
                    </p>
                </motion.div>

                {/* SWOT BENTO TILE */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="brutal-card p-6 md:col-span-2 md:row-span-1 bg-white"
                >
                    <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-borderDark inline-block pb-1">
                        <TextScramble text="SWOT Matrix" />
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-borderDark p-3 bg-emerald-100">
                            <h4 className="font-black uppercase text-sm mb-2">Strengths</h4>
                            <ul className="list-disc pl-4 font-mono text-xs space-y-1">
                                {result.swot?.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="border-2 border-borderDark p-3 bg-red-100">
                            <h4 className="font-black uppercase text-sm mb-2">Weaknesses</h4>
                            <ul className="list-disc pl-4 font-mono text-xs space-y-1">
                                {result.swot?.weaknesses?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="border-2 border-borderDark p-3 bg-blue-100">
                            <h4 className="font-black uppercase text-sm mb-2">Opportunities</h4>
                            <ul className="list-disc pl-4 font-mono text-xs space-y-1">
                                {result.swot?.opportunities?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="border-2 border-borderDark p-3 bg-orange-100">
                            <h4 className="font-black uppercase text-sm mb-2">Threats</h4>
                            <ul className="list-disc pl-4 font-mono text-xs space-y-1">
                                {result.swot?.threats?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* MONETIZATION BENTO TILE */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="brutal-card p-6 md:col-span-1 md:row-span-1 bg-purple-100 flex flex-col group"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-300 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            💡
                        </div>
                        <h3 className="text-2xl font-black uppercase border-b-4 border-borderDark inline-block pb-1">
                            <TextScramble text="Monetization" />
                        </h3>
                    </div>
                    <p className="font-mono text-sm leading-relaxed font-semibold">
                        {result.monetization}
                    </p>
                </motion.div>
            </motion.div>

            {/* Pivot Me Section (Only renders if score < 60) */}
            <PivotMe viabilityScore={finalScore} originalIdea={analysis.idea_text} />
        </div>
    );
}
