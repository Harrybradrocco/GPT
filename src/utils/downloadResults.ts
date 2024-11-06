import { Results, Load, Beam, BeamDiagramPoint } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DownloadData {
  results: Results;
  loads: Load[];
  beam: Beam;
  diagramPoints: BeamDiagramPoint[];
}

const generateTextContent = (data: DownloadData) => {
  const { results, loads, beam } = data;
  
  const formatNumber = (num: number) => num.toFixed(2).padStart(10);
  const formatLabel = (label: string) => label.padEnd(25);
  
  return [
    'Enhanced Load Calculator Results',
    '================================',
    '',
    'Beam Configuration',
    '----------------',
    `${formatLabel('Type:')}${beam.type}`,
    `${formatLabel('Length:')}${beam.length} mm`,
    `${formatLabel('Material:')}${beam.material.name}`,
    '',
    'Applied Loads',
    '-------------',
    ...loads.map((load, i) => [
      `Load ${i + 1}:`,
      `${formatLabel('  Type:')}${load.type}`,
      `${formatLabel('  Force:')}${load.force}${load.type === 'point' ? 'N' : 'N/m'}`,
      `${formatLabel('  Distance from left:')}${load.distance} mm`,
      load.type === 'point' 
        ? `${formatLabel('  Angle:')}${load.angle}°`
        : `${formatLabel('  Length:')}${load.length} mm`,
      ''
    ]).flat(),
    'Analysis Results',
    '----------------',
    `${formatLabel('Resultant Force:')}${formatNumber(results.resultantForce)} N`,
    `${formatLabel('Resultant Angle:')}${formatNumber(results.resultantAngle)}°`,
    `${formatLabel('Reaction Force A:')}${formatNumber(results.reactionForceA)} N`,
    `${formatLabel('Reaction Force B:')}${formatNumber(results.reactionForceB)} N`,
    `${formatLabel('Max Shear Force:')}${formatNumber(results.maxShearForce)} N`,
    `${formatLabel('Max Bending Moment:')}${formatNumber(results.maxBendingMoment * 1000)} N·mm`,
    `${formatLabel('Max Normal Stress:')}${formatNumber(results.maxNormalStress)} MPa`,
    `${formatLabel('Max Shear Stress:')}${formatNumber(results.maxShearStress)} MPa`,
    `${formatLabel('Max Deflection:')}${formatNumber(results.deflection * 1000)} mm`,
    `${formatLabel('Safety Factor:')}${formatNumber(results.safetyFactor)}`,
    `${formatLabel('Center of Gravity:')}${formatNumber(results.centerOfGravity)} mm`,
    '',
    'Section Properties',
    '-----------------',
    `${formatLabel('Cross-sectional Area:')}${formatNumber(results.area)} mm²`,
    `${formatLabel('Moment of Inertia:')}${formatNumber(results.momentOfInertia)} mm⁴`,
    ''
  ].join('\n');
};

const captureCharts = async () => {
  const charts = document.querySelectorAll('.recharts-wrapper');
  const captures = [];

  for (const chart of Array.from(charts)) {
    const canvas = await html2canvas(chart as HTMLElement, {
      backgroundColor: null,
      removeContainer: true,
      scale: 2,
      logging: false,
      onclone: (doc, elem) => {
        elem.querySelectorAll('.recharts-cartesian-grid').forEach(grid => {
          (grid as HTMLElement).style.opacity = '0.3';
        });
        elem.querySelectorAll('.recharts-surface').forEach(surface => {
          (surface as HTMLElement).style.background = 'none';
        });
      }
    });
    captures.push(canvas.toDataURL('image/png'));
  }

  return captures;
};

export const downloadResults = async (data: DownloadData, format: 'txt' | 'pdf' = 'txt') => {
  if (format === 'txt') {
    const content = generateTextContent(data);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beam-calculator-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true
      });

      // Add custom font
      pdf.addFont('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf', 'Poppins', 'normal');
      pdf.addFont('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf', 'Poppins', 'bold');

      // Set default font
      pdf.setFont('Poppins');

      // Add title
      pdf.setFontSize(24);
      pdf.setFont('Poppins', 'bold');
      pdf.text('Beam Analysis Report', 105, 20, { align: 'center' });
      
      // Add date and document info
      pdf.setFontSize(10);
      pdf.setFont('Poppins', 'normal');
      pdf.text(new Date().toLocaleDateString(), 20, 35);
      pdf.text('Enhanced Load Calculator', 20, 40);
      
      // Add horizontal line
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.line(20, 45, 190, 45);

      let y = 60;

      // Beam Configuration Section
      pdf.setFont('Poppins', 'bold');
      pdf.setFontSize(16);
      pdf.text('1. Beam Configuration', 20, y);
      y += 10;

      pdf.setFont('Poppins', 'normal');
      pdf.setFontSize(11);
      pdf.text([
        `Type: ${data.beam.type}`,
        `Length: ${data.beam.length} mm`,
        `Material: ${data.beam.material.name}`
      ], 25, y);
      y += 25;

      // Applied Loads Section
      pdf.setFont('Poppins', 'bold');
      pdf.setFontSize(16);
      pdf.text('2. Applied Loads', 20, y);
      y += 10;

      pdf.setFont('Poppins', 'normal');
      pdf.setFontSize(11);
      data.loads.forEach((load, index) => {
        pdf.text([
          `Load ${index + 1}:`,
          `  • Type: ${load.type}`,
          `  • Force: ${load.force}${load.type === 'point' ? 'N' : 'N/m'}`,
          `  • Distance: ${load.distance} mm`,
          load.type === 'point' 
            ? `  • Angle: ${load.angle}°`
            : `  • Length: ${load.length} mm`
        ], 25, y);
        y += 25;
      });

      // Analysis Results Section
      pdf.setFont('Poppins', 'bold');
      pdf.setFontSize(16);
      pdf.text('3. Analysis Results', 20, y);
      y += 15;

      // Create a table for results with LaTeX-style borders
      const resultData = [
        ['Parameter', 'Value', 'Unit'],
        ['Resultant Force', data.results.resultantForce.toFixed(2), 'N'],
        ['Resultant Angle', data.results.resultantAngle.toFixed(2), '°'],
        ['Max Shear Force', data.results.maxShearForce.toFixed(2), 'N'],
        ['Max Bending Moment', (data.results.maxBendingMoment * 1000).toFixed(2), 'N·mm'],
        ['Max Normal Stress', data.results.maxNormalStress.toFixed(2), 'MPa'],
        ['Max Shear Stress', data.results.maxShearStress.toFixed(2), 'MPa'],
        ['Max Deflection', (data.results.deflection * 1000).toFixed(2), 'mm'],
        ['Safety Factor', data.results.safetyFactor.toFixed(2), '-']
      ];

      // Add table with LaTeX-style formatting
      pdf.setFontSize(10);
      const startY = y;
      const cellWidth = [100, 50, 30]; // Adjusted widths
      const cellHeight = 8;
      const tableX = 20;
      
      // Draw table header with thick border
      pdf.setLineWidth(0.5);
      pdf.line(tableX, startY, tableX + cellWidth.reduce((a, b) => a + b, 0), startY); // Top border
      
      resultData.forEach((row, rowIndex) => {
        const rowY = startY + rowIndex * cellHeight;
        
        // Set font style for header
        pdf.setFont('Poppins', rowIndex === 0 ? 'bold' : 'normal');
        
        // Draw cell borders
        let currentX = tableX;
        row.forEach((cell, colIndex) => {
          // Draw vertical borders
          pdf.line(currentX, rowY, currentX, rowY + cellHeight);
          
          // Draw text
          pdf.text(
            cell.toString(),
            currentX + 3,
            rowY + cellHeight - 2
          );
          
          currentX += cellWidth[colIndex];
        });
        
        // Draw last vertical border
        pdf.line(currentX, rowY, currentX, rowY + cellHeight);
        
        // Draw horizontal border
        pdf.line(tableX, rowY + cellHeight, tableX + cellWidth.reduce((a, b) => a + b, 0), rowY + cellHeight);
      });

      y = startY + resultData.length * cellHeight + 20;

      // Add diagrams with LaTeX-style captions
      const chartImages = await captureCharts();
      
      if (chartImages.length > 0) {
        pdf.addPage();
        
        pdf.setFont('Poppins', 'bold');
        pdf.setFontSize(16);
        pdf.text('4. Force Diagrams', 20, 20);

        let currentY = 30;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - 40;
        
        chartImages.forEach((imgData, index) => {
          if (currentY > pdf.internal.pageSize.getHeight() - 60) {
            pdf.addPage();
            currentY = 30;
          }

          // Add figure number and caption
          pdf.setFont('Poppins', 'bold');
          pdf.setFontSize(11);
          const caption = index === 0 
            ? 'Figure 4.1: Shear Force Diagram' 
            : 'Figure 4.2: Bending Moment Diagram';
          pdf.text(caption, 20, currentY - 5);

          // Add chart image
          pdf.addImage(
            imgData,
            'PNG',
            20,
            currentY,
            maxWidth,
            maxWidth * 0.4
          );
          
          currentY += (maxWidth * 0.4) + 30;
        });
      }

      pdf.save('beam-analysis-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try downloading as text instead.');
    }
  }
};