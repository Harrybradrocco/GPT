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
        // Remove backgrounds from chart elements
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

      // Set font to courier for monospace formatting
      pdf.setFont('courier');
      pdf.setFontSize(10);

      // Add text content
      const content = generateTextContent(data).split('\n');
      let y = 10;
      
      content.forEach(line => {
        if (line.startsWith('===')) {
          pdf.setFont('courier', 'bold');
          y += 2;
        } else if (line.startsWith('---')) {
          y += 2;
        } else {
          pdf.setFont('courier', 'normal');
          if (line.trim()) {
            pdf.text(line, 10, y);
          }
          y += 5;
        }
      });

      // Add diagrams
      const chartImages = await captureCharts();
      
      if (chartImages.length > 0) {
        // Add a new page for charts
        pdf.addPage();
        
        let currentY = 20;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - 20; // 10mm margin on each side
        
        chartImages.forEach((imgData, index) => {
          if (currentY > pdf.internal.pageSize.getHeight() - 40) {
            pdf.addPage();
            currentY = 20;
          }

          // Add chart title
          pdf.setFont('courier', 'bold');
          pdf.text(
            index === 0 ? 'Shear Force Diagram' : 'Bending Moment Diagram',
            10,
            currentY - 5
          );

          // Add chart image
          pdf.addImage(
            imgData,
            'PNG',
            10,
            currentY,
            maxWidth,
            maxWidth * 0.4
          );
          
          currentY += (maxWidth * 0.4) + 20;
        });
      }

      pdf.save('beam-calculator-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try downloading as text instead.');
    }
  }
};