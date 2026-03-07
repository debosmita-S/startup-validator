import { useState, useEffect } from 'react';

export default function TextScramble({ text, className = '' }) {
    const chars = '!<>-_\\\\/[]{}—=+*^?#________';
    const [displayText, setDisplayText] = useState('');
    const [isScrambling, setIsScrambling] = useState(true);

    useEffect(() => {
        let iteration = 0;
        let animationFrame;
        const maxIterations = 20;

        const updateText = () => {
            const scrambled = text
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            setDisplayText(scrambled);

            if (iteration >= text.length) {
                setIsScrambling(false);
                return;
            }

            iteration += 1 / 3;
            animationFrame = requestAnimationFrame(updateText);
        };

        animationFrame = requestAnimationFrame(updateText);

        return () => cancelAnimationFrame(animationFrame);
    }, [text]);

    return (
        <span className={`${className} ${isScrambling ? 'font-mono' : ''}`}>
            {displayText}
        </span>
    );
}
