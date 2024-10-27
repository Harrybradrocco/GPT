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
  const { results, loads, beam, diagramPoints } = data;
  
  return `
Enhanced Load Calculator Results
==============================

Beam Configuration
-----------------
Type: ${beam.type}
Length: ${beam.length}m

Applied Loads
------------
${loads.map((load, i) => `
Load ${i + 1}:
  Type: ${load.type}
  Force: ${load.force}${load.type === 'point' ? 'N' : 'N/m'}
  Distance from left: ${load.distance}m
  ${load.type === 'point' ? `Angle: ${load.angle}°` : `Length: ${load.length}m`}
`).join('\n')}

Results
-------
Resultant Force: ${results.resultantForce.toFixed(2)} N
Resultant Angle: ${results.resultantAngle.toFixed(2)}°
Reaction Force A: ${results.reactionForceA.toFixed(2)} N
Reaction Force B: ${results.reactionForceB.toFixed(2)} N
Max Shear Force: ${results.maxShearForce.toFixed(2)} N
Max Bending Moment: ${results.maxBendingMoment.toFixed(2)} Nm
Center of Gravity: ${results.centerOfGravity.toFixed(2)} m

Diagram Points
-------------
Distance (m) | Shear Force (N) | Bending Moment (Nm)
${diagramPoints.map(p => 
  `${p.distance.toFixed(2).padStart(10)} | ${p.shearForce.toFixed(2).padStart(13)} | ${p.bendingMoment.toFixed(2).padStart(16)}`
).join('\n')}
`;
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
    const pdf = new jsPDF('p', 'mm', 'a4');
    const content = generateTextContent(data);
    
    // Add text content
    const lines = content.split('\n');
    let y = 10;
    lines.forEach(line => {
      if (line.startsWith('===')) {
        y += 2;
      } else if (line.startsWith('---')) {
        y += 2;
      } else {
        pdf.setFontSize(10);
        pdf.text(line, 10, y);
        y += 5;
      }
    });
    
    // Add diagrams
    try {
      const diagrams = document.querySelectorAll('.bg-gray-700\\/50');
      let currentY = y + 10;
      
      for (const diagram of Array.from(diagrams)) {
        const canvas = await html2canvas(diagram as HTMLElement);
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate scaled dimensions to fit PDF width
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Add new page if diagram won't fit
        if (currentY + pdfHeight > pdf.internal.pageSize.getHeight()) {
          pdf.addPage();
          currentY = 10;
        }
        
        pdf.addImage(imgData, 'PNG', 10, currentY, pdfWidth - 20, pdfHeight - 20);
        currentY += pdfHeight;
      }
      
      pdf.save('beam-calculator-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try downloading as text instead.');
    }
  }
};