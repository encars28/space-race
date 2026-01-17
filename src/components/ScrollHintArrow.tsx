import { useEffect, useState } from 'react';
import './ScrollHintArrow.css';

export default function ScrollHintArrow() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Consider "at bottom" when within 100px of the bottom
      const atBottom = scrollTop + windowHeight >= docHeight - 100;
      setIsAtBottom(atBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAtBottom) return null;

  return (
    <div className="scroll-hint-arrow">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </div>
  );
}
