import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFOptions {
  fileName?: string;
  forceMethod?: 'native' | 'programmatic';
}

class PDFExportService {
  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  private isWebView(): boolean {
    // Detect if running in WebView (like in mobile apps)
    return /wv|WebView/i.test(navigator.userAgent) || 
           (window as any).ReactNativeWebView !== undefined;
  }

  private shouldUseProgrammatic(forceMethod?: string): boolean {
    if (forceMethod) {
      return forceMethod === 'programmatic';
    }
    
    // Use programmatic for iOS or WebViews
    return this.isIOS() || this.isWebView();
  }

  private async prepareForCapture(): Promise<() => void> {
    const body = document.body;
    const cvContainer = document.querySelector('.cv-container') as HTMLElement;
    
    // Store original classes
    const originalBodyClass = body.className;
    const originalCollapsibleStates: Array<{element: HTMLElement, isOpen: boolean}> = [];
    
    // Open all collapsibles for PDF
    const collapsibles = document.querySelectorAll('[data-collapsible-content="true"]') as NodeListOf<HTMLElement>;
    collapsibles.forEach(element => {
      const isCurrentlyOpen = element.style.maxHeight !== '0px' && element.style.maxHeight !== '';
      originalCollapsibleStates.push({ element, isOpen: isCurrentlyOpen });
      
      if (!isCurrentlyOpen) {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.opacity = '1';
      }
    });
    
    // Add capture class for PDF-specific styles
    body.classList.add('capture-pdf');
    
    // Return cleanup function
    return () => {
      // Restore original body class
      body.className = originalBodyClass;
      
      // Restore collapsible states
      originalCollapsibleStates.forEach(({ element, isOpen }) => {
        if (!isOpen) {
          element.style.maxHeight = '0px';
          element.style.opacity = '0';
        }
      });
    };
  }

  private async exportWithNativePrint(fileName: string = 'CV_Areli_Aguilar.pdf'): Promise<void> {
    const cleanup = await this.prepareForCapture();
    
    try {
      // Store original document title
      const originalTitle = document.title;
      document.title = fileName.replace('.pdf', '');
      
      // Trigger native print dialog
      window.print();
      
      // Restore original title
      document.title = originalTitle;
      
    } finally {
      // Small delay to ensure print dialog is processed
      setTimeout(cleanup, 100);
    }
  }

  private async exportWithCanvas(fileName: string = 'CV_Areli_Aguilar.pdf'): Promise<void> {
    const cleanup = await this.prepareForCapture();
    
    try {
      const cvContainer = document.querySelector('.cv-container') as HTMLElement;
      
      if (!cvContainer) {
        throw new Error('CV container not found');
      }

      // Configure html2canvas options for high quality
      const canvas = await html2canvas(cvContainer, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: null, // Preserve transparency
        logging: false,
        height: cvContainer.scrollHeight,
        width: cvContainer.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        windowWidth: cvContainer.scrollWidth,
        windowHeight: cvContainer.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure styles are properly applied in cloned document
          const clonedContainer = clonedDoc.querySelector('.cv-container') as HTMLElement;
          if (clonedContainer) {
            clonedContainer.style.transform = 'none';
            clonedContainer.style.width = cvContainer.scrollWidth + 'px';
            clonedContainer.style.height = cvContainer.scrollHeight + 'px';
          }
        }
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.height / canvas.width;
      
      let imgWidth = pageWidth;
      let imgHeight = pageWidth * imgAspectRatio;
      
      // If height exceeds page, scale down
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = pageHeight / imgAspectRatio;
      }
      
      // Center the image
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST');

      // Save PDF
      pdf.save(fileName);
      
    } finally {
      cleanup();
    }
  }

  async exportPDF(options: PDFOptions = {}): Promise<void> {
    const { fileName = 'CV_Areli_Aguilar.pdf', forceMethod } = options;
    
    try {
      // Check for keyboard modifiers for force method
      const altPressed = (window.event as any)?.altKey;
      const ctrlPressed = (window.event as any)?.ctrlKey || (window.event as any)?.metaKey;
      
      let method: 'native' | 'programmatic';
      
      if (altPressed) {
        method = 'programmatic'; // Alt+Click forces programmatic
      } else if (ctrlPressed) {
        method = 'native'; // Ctrl/Cmd+Click forces native
      } else if (forceMethod) {
        method = forceMethod;
      } else {
        method = this.shouldUseProgrammatic() ? 'programmatic' : 'native';
      }
      
      console.log(`PDF Export: Using ${method} method`);
      
      if (method === 'programmatic') {
        await this.exportWithCanvas(fileName);
      } else {
        await this.exportWithNativePrint(fileName);
      }
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      
      // Fallback: try alternative method
      try {
        const fallbackMethod = this.shouldUseProgrammatic() ? 'native' : 'programmatic';
        console.log(`Falling back to ${fallbackMethod} method`);
        
        if (fallbackMethod === 'programmatic') {
          await this.exportWithCanvas(fileName);
        } else {
          await this.exportWithNativePrint(fileName);
        }
      } catch (fallbackError) {
        console.error('Fallback PDF export failed:', fallbackError);
        throw new Error('No se pudo generar el PDF. Por favor, intenta nuevamente.');
      }
    }
  }

  // Utility method to check if PDF export is supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           (window.print !== undefined || 
            (typeof html2canvas !== 'undefined' && typeof jsPDF !== 'undefined'));
  }

  // Get recommended method for current environment
  getRecommendedMethod(): 'native' | 'programmatic' {
    return this.shouldUseProgrammatic() ? 'programmatic' : 'native';
  }
}

// Create and export singleton instance
export const pdfExportService = new PDFExportService();
export default pdfExportService;