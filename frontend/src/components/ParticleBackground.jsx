import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticleBackground({ isAnalyzing = false }) {
    const [init, setInit] = useState(false);

    // Initialize the particles engine once
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(() => {
        return {
            background: {
                color: { value: 'transparent' },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: isAnalyzing ? 'attract' : 'repulse',
                    },
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    attract: { distance: 200, duration: 0.4, factor: 5 },
                },
            },
            particles: {
                color: { value: '#000000' },
                links: {
                    color: '#000000',
                    distance: 150,
                    enable: isAnalyzing, // Only link when analyzing
                    opacity: 0.2,
                    width: 1,
                },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: { default: 'bounce' },
                    random: false,
                    speed: isAnalyzing ? 3 : 1, // Speed up during analysis
                    straight: false,
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: isAnalyzing ? 120 : 60,
                },
                opacity: { value: 0.3 },
                shape: { type: isAnalyzing ? 'square' : 'circle' },
                size: { value: { min: 2, max: 4 } },
            },
            detectRetina: true,
        };
    }, [isAnalyzing]);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="absolute inset-0 -z-10 pointer-events-none"
        />
    );
}
