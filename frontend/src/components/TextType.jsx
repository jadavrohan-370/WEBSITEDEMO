import React, { useState, useEffect } from 'react';

const TextType = ({
    texts = [],
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 1500,
    showCursor = true,
    cursorCharacter = "|",
    className = "",
    style = {}
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [speed, setSpeed] = useState(typingSpeed);

    useEffect(() => {
        let timer;
        const handleTyping = () => {
            const i = loopNum % texts.length;
            const fullText = texts[i];

            setDisplayedText(
                isDeleting
                    ? fullText.substring(0, displayedText.length - 1)
                    : fullText.substring(0, displayedText.length + 1)
            );

            setSpeed(isDeleting ? deletingSpeed : typingSpeed);

            if (!isDeleting && displayedText === fullText) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && displayedText === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        timer = setTimeout(handleTyping, speed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, loopNum, texts, typingSpeed, deletingSpeed, pauseDuration, speed]);

    return (
        <span className={className} style={{ display: 'inline-block', ...style }}>
            {displayedText}
            {showCursor && (
                <span className="animate-pulse ml-1 text-amber-600">{cursorCharacter}</span>
            )}
        </span>
    );
};

export default TextType;
