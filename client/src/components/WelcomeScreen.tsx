import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-48 h-48 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ top: '50%', right: '20%' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse-glow" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-gradient">
            Saint & Summer
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-6">
            The Island That Listens
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Join Saint and Summer on a magical adventure where listening is more powerful than leading, 
          and quiet wisdom lights the way home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8"
        >
          <Button
            size="lg"
            onClick={onStart}
            className="gap-3 text-lg px-8 py-6 shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="w-6 h-6" />
            Begin the Adventure
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
              <span>Tap characters to hear them speak</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent animate-shimmer" />
              <span>Discover interactive elements</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground italic">
            Best experienced on tablet or mobile device
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm font-semibold text-primary mb-2">
            Big hearts. Big dreams. Bigger world.
          </p>
          <p className="text-xs text-muted-foreground">
            Saint & Summer: The Tall Kids' Adventures
          </p>
        </motion.div>
      </div>
    </div>
  );
}
