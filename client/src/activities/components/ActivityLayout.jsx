import React from 'react';
import { motion } from 'framer-motion';

// Premium Glassmorphism Layout
const ActivityLayout = ({
    children,
    title,
    subtitle,
    color = "from-violet-600/20 to-pink-600/20",
    onRestart,
    onSkip,
    onNext,
    onReplay
}) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[var(--bg-primary)] flex flex-col antialiased">

            {/* Dynamic Background Mesh */}
            <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${color} blur-[120px] pointer-events-none`} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-6 pt-20 pb-32 overflow-y-auto custom-scrollbar">

                {/* Header */}
                {title && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-12 text-center w-full"
                    >
                        <h2 className="text-4xl font-black uppercase tracking-tighter title-gradient drop-shadow-2xl">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-[var(--text-secondary)] text-xs font-bold tracking-[0.2em] mt-2 opacity-60 uppercase">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Main Content Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="w-full max-w-md flex flex-col items-center"
                >
                    {children}
                </motion.div>

            </div>

            {/* Premium Universal Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-50 px-6 py-8 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-sm">
                <div className="flex items-center justify-between max-w-md mx-auto gap-3">

                    <div className="flex gap-2">
                        {/* Replay */}
                        {(onReplay || onRestart) && (
                            <button
                                onClick={onReplay || onRestart}
                                title="Replay"
                                className="w-12 h-12 flex-center btn-secondary !p-0 !rounded-full text-xl"
                            >
                                ↺
                            </button>
                        )}

                        {/* Skip */}
                        {onSkip && (
                            <button
                                onClick={onSkip}
                                title="Skip"
                                className="w-12 h-12 flex-center btn-secondary !p-0 !rounded-full text-xl"
                            >
                                ⏭
                            </button>
                        )}
                    </div>

                    {/* Next */}
                    {onNext && (
                        <button
                            onClick={onNext}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 group"
                        >
                            <span className="tracking-tight">KEEP GOING</span>
                            <span className="text-xl group-active:translate-x-1 transition-transform">→</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLayout;
