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
    `${formatLabel('Length:')}${beam.length}m`,
    `${formatLabel('Material:')}${beam.material.name}`,
    '',
    'Applied Loads',
    '-------------',
    ...loads.map((load, i) => [
      `Load ${i + 1}:`,
      `${formatLabel('  Type:')}${load.type}`,
      `${formatLabel('  Force:')}${load.force}${load.type === 'point' ? 'N' : 'N/m'}`,
      `${formatLabel('  Distance from left:')}${load.distance}m`,
      load.type === 'point' 
        ? `${formatLabel('  Angle:')}${load.angle}°`
        : `${formatLabel('  Length:')}${load.length}m`,
      ''
    ]).flat(),
    'Analysis Results',
    '----------------',
    `${formatLabel('Resultant Force:')}${formatNumber(results.resultantForce)} N`,
    `${formatLabel('Resultant Angle:')}${formatNumber(results.resultantAngle)}°`,
    `${formatLabel('Reaction Force A:')}${formatNumber(results.reactionForceA)} N`,
    `${formatLabel('Reaction Force B:')}${formatNumber(results.reactionForceB)} N`,
    `${formatLabel('Max Shear Force:')}${formatNumber(results.maxShearForce)} N`,
    `${formatLabel('Max Bending Moment:')}${formatNumber(results.maxBendingMoment)} Nm`,
    `${formatLabel('Max Normal Stress:')}${formatNumber(results.maxNormalStress)} MPa`,
    `${formatLabel('Max Shear Stress:')}${formatNumber(results.maxShearStress)} MPa`,
    `${formatLabel('Max Deflection:')}${formatNumber(results.deflection * 1000)} mm`,
    `${formatLabel('Safety Factor:')}${formatNumber(results.safetyFactor)}`,
    `${formatLabel('Center of Gravity:')}${formatNumber(results.centerOfGravity)} m`,
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
        compress: true
      });

      // Add title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('Beam Analysis Report', 105, 20, { align: 'center' });
      
      // Add date
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(new Date().toLocaleDateString(), 105, 30, { align: 'center' });

      let y = 40;

      // Beam Configuration Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('1. Beam Configuration', 20, y);
      y += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text([
        `Type: ${data.beam.type}`,
        `Length: ${data.beam.length} mm`,
        `Material: ${data.beam.material.name}`
      ], 25, y);
      y += 20;

      // Applied Loads Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('2. Applied Loads', 20, y);
      y += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      data.loads.forEach((load, index) => {
        pdf.text([
          `Load ${index + 1}:`,
          `  • Type: ${load.type}`,
          `  • Force: ${load.force}${load.type === 'point' ? 'N' : 'N/m'}`,
          `  • Distance: ${load.distance}mm`,
          load.type === 'point' 
            ? `  • Angle: ${load.angle}°`
            : `  • Length: ${load.length}mm`
        ], 25, y);
        y += 25;
      });

      // Analysis Results Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('3. Analysis Results', 20, y);
      y += 10;

      // Create a table for results
      const resultData = [
        ['Parameter', 'Value', 'Unit'],
        ['Resultant Force', data.results.resultantForce.toFixed(2), 'N'],
        ['Resultant Angle', data.results.resultantAngle.toFixed(2), '°'],
        ['Max Shear Force', data.results.maxShearForce.toFixed(2), 'N'],
        ['Max Bending Moment', data.results.maxBendingMoment.toFixed(2), 'Nm'],
        ['Max Normal Stress', data.results.maxNormalStress.toFixed(2), 'MPa'],
        ['Max Shear Stress', data.results.maxShearStress.toFixed(2), 'MPa'],
        ['Max Deflection', (data.results.deflection * 1000).toFixed(2), 'mm'],
        ['Safety Factor', data.results.safetyFactor.toFixed(2), '-']
      ];

      // Add table
      pdf.setFontSize(10);
      const startY = y;
      const cellWidth = 50;
      const cellHeight = 8;
      
      resultData.forEach((row, index) => {
        pdf.setFont('helvetica', index === 0 ? 'bold' : 'normal');
        row.forEach((cell, colIndex) => {
          pdf.rect(20 + colIndex * cellWidth, startY + index * cellHeight, cellWidth, cellHeight);
          pdf.text(cell.toString(), 25 + colIndex * cellWidth, startY + index * cellHeight + 5);
        });
      });

      y = startY + resultData.length * cellHeight + 20;

      // Add diagrams
      const chartImages = await captureCharts();
      
      if (chartImages.length > 0) {
        pdf.addPage();
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('4. Force Diagrams', 20, 20);

        let currentY = 30;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - 40; // 20mm margin on each side
        
        chartImages.forEach((imgData, index) => {
          if (currentY > pdf.internal.pageSize.getHeight() - 40) {
            pdf.addPage();
            currentY = 30;
          }

          // Add chart title
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.text(
            index === 0 ? '4.1 Shear Force Diagram' : '4.2 Bending Moment Diagram',
            20,
            currentY - 5
          );

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