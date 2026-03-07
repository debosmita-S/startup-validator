import { useState } from 'react';
import { Lightbulb, Send, Loader2 } from 'lucide-react';

export default function IdeaInputForm({ onSubmit, isLoading }) {
    const [idea, setIdea] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!idea.trim() || isLoading) return;
        onSubmit(idea.trim(), description.trim());
    };

    const exampleIdeas = [
        'AI-powered personal finance advisor',
        'Marketplace for freelance chefs',
        'Carbon footprint tracking app for businesses',
        'VR-based remote physical therapy',
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-yellow-300 border-4 border-borderDark shadow-[2px_2px_0_0_#000]">
                    <Lightbulb size={24} className="text-borderDark" strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-borderDark uppercase tracking-tight">Your Startup Idea</h2>
                    <p className="text-sm font-mono font-bold text-gray-600">Get AI-powered market analysis in seconds</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Idea input */}
                <div>
                    <label className="block text-sm font-black uppercase text-borderDark mb-2">
                        Core Concept <span className="text-brandPrimary">*</span>
                    </label>
                    <input
                        type="text"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g. AI-powered personal finance advisor"
                        disabled={isLoading}
                        className="input-brutal"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-black uppercase text-borderDark mb-2">
                        Additional Details <span className="text-gray-500 lowercase font-mono">(optional)</span>
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Target audience, problem you're solving, unique angle..."
                        disabled={isLoading}
                        className="input-brutal resize-vertical"
                    />
                </div>

                {/* Example chips */}
                <div>
                    <p className="text-xs font-black uppercase text-gray-500 mb-2">Try an example:</p>
                    <div className="flex flex-wrap gap-2">
                        {exampleIdeas.map((ex) => (
                            <button
                                key={ex}
                                type="button"
                                onClick={() => setIdea(ex)}
                                disabled={isLoading}
                                className="text-xs px-3 py-1.5 font-bold font-mono bg-blue-100 text-borderDark 
                                border-2 border-borderDark shadow-[2px_2px_0_0_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000]
                                transition-all duration-100 disabled:opacity-40"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!idea.trim() || isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Analyzing your idea...
                        </>
                    ) : (
                        <>
                            <Send size={20} strokeWidth={3} />
                            Validate Now
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
