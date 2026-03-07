// Generic info card used for text-based sections

export default function AnalysisCard({ title, icon: Icon, color, children, delay = 0 }) {
    return (
        <div
            className="glass-card p-6 animate-slide-up"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` }}
                >
                    <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
            </div>

            {children}
        </div>
    );
}
