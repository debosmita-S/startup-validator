import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnalysis, deleteAnalysis } from '../services/api';
import AnalysisResults from '../components/AnalysisResults';
import { ArrowLeft, Trash2, Loader2, AlertCircle, Clock } from 'lucide-react';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function AnalysisDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getAnalysis(id);
                setAnalysis(data);
            } catch (err) {
                setError(err.response?.status === 404 ? 'Analysis not found.' : 'Failed to load analysis.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Delete this analysis permanently?')) return;
        setDeleting(true);
        try {
            await deleteAnalysis(id);
            navigate('/history');
        } catch {
            alert('Failed to delete.');
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b-4 border-borderDark flex-wrap gap-4">
                <Link
                    to="/history"
                    className="flex items-center gap-2 text-borderDark font-black uppercase text-sm border-2 border-borderDark px-4 py-2 hover:-translate-y-0.5 shadow-[2px_2px_0_0_#000] bg-white transition-transform"
                >
                    <ArrowLeft size={16} strokeWidth={3} />
                    Back
                </Link>

                {analysis && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 uppercase px-4 py-2 border-2 border-borderDark bg-gray-100 shadow-[2px_2px_0_0_#000]">
                            <Clock size={14} strokeWidth={3} />
                            {formatDate(analysis.timestamp)}
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="btn-danger flex items-center gap-2"
                        >
                            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={3} />}
                            {deleting ? 'DELETING...' : 'DELETE'}
                        </button>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-borderDark">
                    <Loader2 size={48} className="animate-spin text-brandPrimary" strokeWidth={3} />
                    <p className="font-black uppercase text-xl mt-4 tracking-widest">Loading Report...</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="brutal-card bg-red-100 p-8 flex flex-col items-center text-center max-w-lg mx-auto gap-4">
                    <AlertCircle size={48} className="text-red-500" strokeWidth={3} />
                    <div>
                        <p className="text-2xl font-black uppercase text-red-900 mb-2">{error}</p>
                        <Link to="/history" className="text-red-700 font-mono font-bold text-sm hover:underline border-b-2 border-red-700">
                            Return to History
                        </Link>
                    </div>
                </div>
            )}

            {/* Results */}
            {analysis && !loading && (
                <div className="w-full">
                    <AnalysisResults analysis={analysis} />
                </div>
            )}
        </div>
    );
}
