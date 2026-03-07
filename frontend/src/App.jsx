import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';

export default function App() {
    return (
        <div className="min-h-screen">
            <Navbar />
            {/* Offset for fixed navbar */}
            <main className="pt-20 pb-12">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
                </Routes>
            </main>
        </div>
    );
}
