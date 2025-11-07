import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { storyPages } from '@/data/storyContent';

export interface PDFExportOptions {
  includeInteractiveElements?: boolean;
  quality?: number;
  format?: 'a4' | 'letter';
}

export async function exportBookToPDF(options: PDFExportOptions = {}) {
  const {
    quality = 0.95,
    format = 'letter',
  } = options;

  // Create PDF with appropriate dimensions for print
  // Letter: 8.5 x 11 inches (216 x 279 mm)
  // A4: 210 x 297 mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: format,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15; // 15mm margins
  const contentWidth = pageWidth - (margin * 2);
  const contentHeight = pageHeight - (margin * 2);

  // Add cover page
  pdf.setFillColor(255, 215, 0); // Golden yellow
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(74, 59, 92); // Deep purple
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Saint & Summer', pageWidth / 2, pageHeight / 3, { align: 'center' });
  
  pdf.setFontSize(24);
  pdf.text('The Island That Listens', pageWidth / 2, pageHeight / 2, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Big hearts. Big dreams. Bigger world.', pageWidth / 2, pageHeight * 2 / 3, { align: 'center' });

  // Add story pages
  for (let i = 0; i < storyPages.length; i++) {
    const page = storyPages[i];
    
    pdf.addPage();
    
    // Add page title
    pdf.setFillColor(252, 248, 240); // Soft cream background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    pdf.setTextColor(74, 59, 92);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(page.title, pageWidth / 2, margin + 10, { align: 'center' });
    
    // Add image
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = page.image;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Calculate image dimensions to fit in content area
      const imgAspectRatio = img.width / img.height;
      let imgWidth = contentWidth;
      let imgHeight = imgWidth / imgAspectRatio;
      
      // If image is too tall, scale by height instead
      if (imgHeight > contentHeight * 0.6) {
        imgHeight = contentHeight * 0.6;
        imgWidth = imgHeight * imgAspectRatio;
      }
      
      const imgX = (pageWidth - imgWidth) / 2;
      const imgY = margin + 20;
      
      pdf.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');
      
      // Add story text
      const textY = imgY + imgHeight + 15;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(page.text, contentWidth);
      pdf.text(lines, margin, textY);
      
    } catch (error) {
      console.error(`Error loading image for page ${i + 1}:`, error);
      // Add placeholder text if image fails to load
      pdf.setFontSize(12);
      pdf.text('[Image could not be loaded]', pageWidth / 2, pageHeight / 2, { align: 'center' });
    }
    
    // Add page number
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`${i + 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  // Add credits page
  pdf.addPage();
  pdf.setFillColor(252, 248, 240);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(74, 59, 92);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('About This Book', pageWidth / 2, margin + 20, { align: 'center' });
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const creditsText = [
    '',
    'Saint & Summer: The Tall Kids\' Adventures',
    '',
    'A multicultural children\'s book series grounded in',
    'psychological truth and emotional intelligence.',
    '',
    'This story teaches children that leadership isn\'t about',
    'being the loudest or the first to act. It\'s about being',
    'open, curious, and willing to learn from others—',
    'especially those whose voices are often overlooked.',
    '',
    'The series models healthy sibling relationships,',
    'showing that conflict is normal and navigable.',
    '',
    'For more adventures, visit:',
    'www.saintsummer.com',
  ];
  
  let yPos = margin + 40;
  creditsText.forEach(line => {
    pdf.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
  });
  
  // Save the PDF
  const filename = `Saint_and_Summer_The_Island_That_Listens_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
  
  return filename;
}

export async function exportCurrentPageToPDF(pageElement: HTMLElement, pageTitle: string) {
  const canvas = await html2canvas(pageElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#fcf8f0',
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(`${pageTitle.replace(/\s+/g, '_')}.pdf`);
}
