import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryPage as StoryPageType, InteractiveElement } from '@/data/storyContent';
import { Volume2 } from 'lucide-react';

interface StoryPageProps {
  page: StoryPageType;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function StoryPage({ page, onNext, onPrev }: StoryPageProps) {
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [clickedElements, setClickedElements] = useState<Set<string>>(new Set());

  const handleElementClick = (element: InteractiveElement) => {
    setActiveElement(element.id);
    setClickedElements(prev => new Set(Array.from(prev).concat(element.id)));
    
    // Auto-hide speech bubble after 5 seconds
    setTimeout(() => {
      setActiveElement(null);
    }, 5000);
  };

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse-glow';
      case 'glow':
        return 'animate-pulse-glow';
      case 'shimmer':
        return 'animate-shimmer';
      case 'wiggle':
        return 'animate-wiggle';
      case 'float':
        return 'animate-float';
      case 'sway':
        return 'animate-float';
      case 'ring':
        return 'animate-pulse-glow';
      case 'resonate':
        return 'animate-pulse-glow';
      case 'sparkle':
        return 'animate-shimmer';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4 px-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-glow">
          {page.title}
        </h2>
      </motion.div>

      {/* Interactive Image Container */}
      <div className="relative flex-1 flex items-center justify-center px-4 pb-4">
        <div className="relative w-full max-w-4xl aspect-[4/3]">
          {/* Main Image */}
          <motion.img
            key={page.id}
            src={page.image}
            alt={page.title}
            className="w-full h-full object-contain rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Interactive Hotspots */}
          {page.interactiveElements.map((element) => (
            <div
              key={element.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.width}%`,
                height: `${element.height}%`,
              }}
              onClick={() => handleElementClick(element)}
            >
              {/* Hotspot Indicator */}
              <div
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  clickedElements.has(element.id)
                    ? 'bg-accent/20'
                    : 'bg-primary/30 group-hover:bg-primary/50'
                } ${getAnimationClass(element.animation)}`}
              >
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100 animate-ping" />
                
                {/* Icon indicator */}
                {element.speech && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-primary drop-shadow-lg" />
                  </div>
                )}
              </div>

              {/* Speech Bubble */}
              <AnimatePresence>
                {activeElement === element.id && element.speech && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute z-50 pointer-events-none"
                    style={{
                      left: element.type === 'character' ? '50%' : '50%',
                      top: element.type === 'character' ? '-20px' : '-20px',
                      transform: 'translateX(-50%) translateY(-100%)',
                    }}
                  >
                    <div className="relative bg-card border-2 border-primary rounded-2xl px-4 py-3 shadow-2xl max-w-xs md:max-w-md">
                      <p className="text-sm md:text-base text-card-foreground font-medium">
                        {element.speech}
                      </p>
                      {/* Speech bubble tail */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-full">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Story Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-4 bg-card/80 backdrop-blur-sm border-t-2 border-primary/20"
      >
        <p className="text-base md:text-lg text-card-foreground leading-relaxed text-center max-w-4xl mx-auto">
          {page.text}
        </p>
      </motion.div>

      {/* Tap Hint */}
      {clickedElements.size === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="bg-primary/90 text-primary-foreground px-6 py-3 rounded-full shadow-lg animate-pulse">
            <p className="text-sm md:text-base font-semibold">
              👆 Tap the glowing areas to interact!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
