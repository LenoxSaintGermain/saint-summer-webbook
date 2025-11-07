import { motion } from 'framer-motion';
import { X, Heart, Globe, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutPageProps {
  onClose: () => void;
}

export default function AboutPage({ onClose }: AboutPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            About This Story
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-primary/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Mission */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3 text-foreground">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Saint & Summer: The Tall Kids' Adventures is a multicultural children's book series 
                  grounded in psychological truth and emotional intelligence. We create stories that 
                  teach children that leadership isn't about being the loudest or the first to act—it's 
                  about being open, curious, and willing to learn from others, especially those whose 
                  voices are often overlooked.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Core Values */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Emotional Intelligence</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The series models healthy sibling relationships, showing that conflict is normal and 
                navigable. It provides children with an emotional vocabulary and framework for 
                understanding their own feelings and the feelings of others.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Globe className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Cultural Curiosity</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In an increasingly diverse and interconnected world, these stories cultivate cultural 
                curiosity and empathy, preparing children to be thoughtful global citizens who celebrate 
                both our unique identities and our shared emotional landscape.
              </p>
            </div>
          </motion.section>

          {/* The Four-Stage Sibling Arc */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">The Four-Stage Sibling Arc</h2>
                <p className="text-muted-foreground text-sm">
                  Every story follows a powerful emotional journey that mirrors real relationships:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">1. Wonder</h4>
                <p className="text-sm text-muted-foreground">
                  Joint curiosity and shared discovery create the foundation of connection.
                </p>
              </div>

              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <h4 className="font-semibold text-secondary mb-2">2. Friction</h4>
                <p className="text-sm text-muted-foreground">
                  Misunderstanding and conflict arise from different perspectives.
                </p>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-accent mb-2">3. Growth</h4>
                <p className="text-sm text-muted-foreground">
                  Empathy and perspective-taking lead to repair and insight.
                </p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">4. Harmony</h4>
                <p className="text-sm text-muted-foreground">
                  Shared purpose and deeper connection emerge.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Credits */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">Credits</h2>
            <div className="space-y-2 text-muted-foreground">
              <p className="text-sm">
                <strong className="text-foreground">Story & Concept:</strong> Saint & Summer Creative Team
              </p>
              <p className="text-sm">
                <strong className="text-foreground">Illustrations:</strong> AI-Generated with Creative Direction
              </p>
              <p className="text-sm">
                <strong className="text-foreground">Interactive Design:</strong> Manus AI
              </p>
              <p className="text-sm mt-4">
                <strong className="text-primary">Big hearts. Big dreams. Bigger world.</strong>
              </p>
              <p className="text-xs text-muted-foreground italic mt-2">
                Saint & Summer: The Tall Kids' Adventures
              </p>
            </div>
          </motion.section>

          {/* Close Button */}
          <div className="text-center pt-4">
            <Button
              size="lg"
              onClick={onClose}
              className="gap-2"
            >
              Back to Story
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
