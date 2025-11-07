import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import WelcomeScreen from '@/components/WelcomeScreen';
import Book from '@/components/Book';
import AboutPage from '@/components/AboutPage';
import { exportBookToPDF } from '@/lib/pdfExport';

export default function Home() {
  const [showBook, setShowBook] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleStart = () => {
    setShowBook(true);
  };

  const handleExportPDF = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    toast.loading('Generating print-ready PDF...', {
      description: 'This may take a moment as we prepare all pages.',
    });
    
    try {
      const filename = await exportBookToPDF({
        quality: 0.95,
        format: 'letter',
      });
      
      toast.success('PDF exported successfully!', {
        description: `Saved as ${filename}`,
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShowAbout = () => {
    setShowAbout(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  if (!showBook) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <>
      <Book onExportPDF={handleExportPDF} onShowAbout={handleShowAbout} />
      <AnimatePresence>
        {showAbout && <AboutPage onClose={handleCloseAbout} />}
      </AnimatePresence>
    </>
  );
}
