import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { ChevronLeft, ChevronRight, Home, Download, Maximize, Minimize, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoryPage from './StoryPage';
import { storyPages } from '@/data/storyContent';
import screenfull from 'screenfull';

interface BookProps {
  onExportPDF?: () => void;
  onShowAbout?: () => void;
}

export default function Book({ onExportPDF, onShowAbout }: BookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToHome = () => {
    setDirection(-1);
    setCurrentPage(0);
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
      setIsFullscreen(!isFullscreen);
    }
  };

  // Swipe gesture handling
  const bind = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX < 0) {
        // Swiped left - go to next page
        goToNextPage();
      } else if (swipeX > 0) {
        // Swiped right - go to previous page
        goToPrevPage();
      }
    },
    {
      swipe: {
        distance: 50,
        velocity: 0.5,
      },
    }
  );

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const page = storyPages[currentPage];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToHome}
            disabled={currentPage === 0}
            className="hover:bg-primary/20"
          >
            <Home className="w-5 h-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-bold text-gradient hidden sm:block">
            Saint & Summer: The Island That Listens
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Page indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-foreground">
              Page {currentPage + 1} of {storyPages.length}
            </span>
          </div>
          
          {/* About button */}
          {onShowAbout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowAbout}
              className="hover:bg-primary/20"
            >
              <Info className="w-5 h-5" />
            </Button>
          )}
          
          {/* Fullscreen toggle */}
          {screenfull.isEnabled && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="hover:bg-primary/20"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </Button>
          )}
          
          {/* Export PDF button */}
          {onExportPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area with Swipe Support */}
      <div 
        {...bind()} 
        className="flex-1 relative overflow-hidden touch-pan-y"
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <StoryPage
              page={page}
              onNext={goToNextPage}
              onPrev={goToPrevPage}
            />
          </motion.div>
        </AnimatePresence>

        {/* Swipe hint for first page */}
        {currentPage === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <div className="bg-accent/90 text-accent-foreground px-4 py-2 rounded-full shadow-lg animate-pulse">
              <p className="text-xs md:text-sm font-medium">
                👈 Swipe to navigate 👉
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm border-t border-border">
        <Button
          variant="default"
          size="lg"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {storyPages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentPage ? 1 : -1);
                setCurrentPage(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'bg-primary w-8'
                  : 'bg-muted hover:bg-muted-foreground'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="default"
          size="lg"
          onClick={goToNextPage}
          disabled={currentPage === storyPages.length - 1}
          className="gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile page indicator */}
      <div className="sm:hidden absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border">
          <span className="text-sm font-medium text-foreground">
            {currentPage + 1} / {storyPages.length}
          </span>
        </div>
      </div>
    </div>
  );
}
