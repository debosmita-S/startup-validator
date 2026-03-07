import { motion } from 'framer-motion';

export default function PulseLoader({ progress = 0 }) {
    // If progress is near 100, we speed it up and make it green
    const isAlmostDone = progress > 80;

    return (
        <div className="flex flex-col items-center justify-center gap-6 my-12">
            <motion.div
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${isAlmostDone ? 'border-emerald-500' : 'border-brandPrimary'
                    }`}
                animate={{
                    scale: [1, 1.15, 1],
                    boxShadow: [
                        `0 0 0 0 ${isAlmostDone ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 69, 0, 0.6)'}`,
                        `0 0 0 25px rgba(255, 69, 0, 0)`,
                        `0 0 0 0 rgba(255, 69, 0, 0)`,
                    ],
                }}
                transition={{
                    duration: isAlmostDone ? 0.6 : 1.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                <span className="font-black text-xl">
                    {progress}%
                </span>
            </motion.div>
            <div className="text-center">
                <h3 className="text-xl font-black uppercase tracking-widest mb-2">
                    Validating Idea
                </h3>
                <p className="text-gray-500 font-mono text-sm max-w-xs">
                    Running complex AI models, checking markets, and synthesizing data...
                </p>
            </div>
        </div>
    );
}
