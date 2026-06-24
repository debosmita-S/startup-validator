import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAnalyses, deleteAnalysis } from '../services/api';
import { Clock, Trash2, Eye, TrendingUp, History, AlertCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

function ScoreBadge({ score }) {
    const color =
        score >= 65 ? 'text-borderDark bg-[#10B981] border-borderDark shadow-[2px_2px_0_0_#000]' :
            score >= 45 ? 'text-borderDark bg-[#F59E0B] border-borderDark shadow-[2px_2px_0_0_#000]' :
                'text-white bg-[#EF4444] border-borderDark shadow-[2px_2px_0_0_#000]';
    return (
        <span className={`text-sm font-black px-3 py-1 border-2 ${color} uppercase`}>
            {score}
        </span>
    );
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function HistoryPage() {
    const { isAuthenticated } = useAuth();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAnalyses();
        }
    }, [isAuthenticated]);

    const fetchAnalyses = async () => {
        try {
            setLoading(true);
            const data = await getAllAnalyses();
            setAnalyses(data);
            setError(null);
        } catch (err) {
            setError('Failed to load analyses. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        if (!confirm('Delete this analysis?')) return;
        setDeleting(id);
        try {
            await deleteAnalysis(id);
            setAnalyses((prev) => prev.filter((a) => a.id !== id));
        } catch {
            alert('Failed to delete analysis.');
        } finally {
            setDeleting(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 mt-16 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-10 border-b-4 border-borderDark pb-6 w-full">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#8b5cf6] border-2 border-borderDark shadow-[2px_2px_0_0_#000]">
                        <History size={24} className="text-white" strokeWidth={3} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-borderDark uppercase tracking-tighter">Analysis History</h1>
                        <p className="text-sm font-mono font-bold text-gray-500">All your saved startup validations</p>
                    </div>
                </div>

                <div className="brutal-card p-12 text-center bg-white max-w-xl w-full mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-3 bg-brandPrimary"></div>
                    <LockKeyhole size={64} className="mx-auto text-brandPrimary mb-6" strokeWidth={3} />
                    <h3 className="text-3xl font-black text-borderDark mb-4 uppercase tracking-tight">Access Locked</h3>
                    <p className="text-gray-600 font-mono text-sm mb-8 font-bold leading-relaxed">
                        Authentication is required to view your analysis history. Sign up or log in to securely save and access your reports.
                    </p>
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="btn-primary w-full md:w-auto"
                    >
                        LOGIN / SIGN UP
                    </button>
                </div>

                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 mt-16">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10 border-b-4 border-borderDark pb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-[#8b5cf6] border-2 border-borderDark shadow-[2px_2px_0_0_#000]">
                    <History size={24} className="text-white" strokeWidth={3} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-borderDark uppercase tracking-tighter">Analysis History</h1>
                    <p className="text-sm font-mono font-bold text-gray-500">All your saved startup validations</p>
                </div>
                <div className="ml-auto font-black text-xl border-2 border-borderDark px-4 py-1.5 shadow-[2px_2px_0_0_#000] bg-white">
                    {analyses.length}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-16 text-borderDark font-black uppercase text-xl animate-pulse">
                    Loading records...
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="brutal-card bg-red-100 p-6 flex items-start gap-4 flex-col text-center shadow-brutal mx-auto max-w-lg mb-8">
                    <AlertCircle size={32} className="text-red-500 mx-auto" strokeWidth={3} />
                    <div>
                        <h3 className="text-xl font-black text-red-900 uppercase">Error Loading History</h3>
                        <p className="text-red-800 font-mono mt-2 font-bold">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && analyses.length === 0 && (
                <div className="brutal-card p-16 text-center animate-fade-in bg-white max-w-2xl mx-auto">
                    <TrendingUp size={64} className="mx-auto text-gray-300 mb-6" strokeWidth={3} />
                    <h3 className="text-2xl font-black text-borderDark mb-2 uppercase">No Analyses Yet</h3>
                    <p className="text-gray-500 font-mono text-sm mb-8 font-bold">
                        Analyze your first startup idea to see it here.
                    </p>
                    <Link to="/" className="btn-primary inline-block">
                        GET STARTED
                    </Link>
                </div>
            )}

            {/* List */}
            {!loading && analyses.length > 0 && (
                <div className="space-y-6">
                    {analyses.map((a, idx) => (
                        <Link
                            key={a.id}
                            to={`/analysis/${a.id}`}
                            className="brutal-card p-6 flex items-center gap-6 block hover:-translate-y-1 hover:shadow-brutal-lg transition-all"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            {/* Score circle mini */}
                            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 border-4 border-borderDark bg-borderDark text-white shadow-[4px_4px_0_0_#FF4500]">
                                <span className="text-2xl font-black">{a.viability_score ?? '?'}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-black text-borderDark truncate uppercase">{a.idea_text}</h3>
                                {a.description && (
                                    <p className="text-gray-600 font-mono text-sm truncate mt-1 font-bold">{a.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <Clock size={14} className="text-borderDark" strokeWidth={3} />
                                    <span className="text-xs font-mono font-bold text-gray-500 uppercase">{formatDate(a.timestamp)}</span>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-4 flex-shrink-0 border-l-4 border-borderDark pl-6">
                                <ScoreBadge score={a.viability_score ?? 0} />
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={(e) => handleDelete(a.id, e)}
                                        disabled={deleting === a.id}
                                        className="btn-danger !px-2 !py-2 !text-xs"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
