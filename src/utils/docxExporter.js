import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  VerticalMergeType, 
  AlignmentType, 
  BorderStyle, 
  HeadingLevel 
} from 'docx';

/**
 * Parses markdown text into structured blocks (heading, paragraph, table)
 */
export function parseMarkdown(markdownText) {
  const lines = markdownText.split('\n');
  const blocks = [];
  let currentTable = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('|')) {
      // Skip separator lines like |---|---|---|
      if (line.includes('---')) {
        continue;
      }
      
      const cells = line.split('|').map(c => c.trim()).slice(1, -1);
      if (!currentTable) {
        currentTable = [];
      }
      currentTable.push(cells);
    } else {
      if (currentTable) {
        blocks.push({ type: 'table', data: currentTable });
        currentTable = null;
      }
      
      if (line === '') {
        continue;
      }
      
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s+/, '');
        blocks.push({ type: 'heading', level, text });
      } else {
        blocks.push({ type: 'paragraph', text: line });
      }
    }
  }
  
  if (currentTable) {
    blocks.push({ type: 'table', data: currentTable });
  }
  
  return blocks;
}

/**
 * Computes vertical merges for specific columns in a table matrix
 */
function computeVerticalMerge(matrix, columnsToMerge) {
  const mergeMap = matrix.map(row => row.map(() => ({ type: null }))); // null, 'restart', 'continue'
  
  for (const colIdx of columnsToMerge) {
    let lastVal = null;
    let lastRestartRow = -1;
    
    for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
      const currentVal = matrix[rowIdx][colIdx]?.trim();
      if (!currentVal) continue;
      
      if (currentVal === lastVal && lastRestartRow !== -1) {
        mergeMap[rowIdx][colIdx] = { type: 'continue' };
      } else {
        lastVal = currentVal;
        lastRestartRow = rowIdx;
        mergeMap[rowIdx][colIdx] = { type: 'restart' };
      }
    }
  }
  return mergeMap;
}

/**
 * Helper to parse inline markdown formatting (bold, italic) and convert to TextRuns
 */
function parseInlineMarkdown(text, forceBold = false) {
  // Replace checklist symbols
  let cleanText = text
    .replace(/\[[xX]\]/g, '✅')
    .replace(/\[\s*\]/g, '☐');

  const runs = [];
  // Simple bold pattern: **text**
  const parts = cleanText.split(/(\*\*.*?\*\*)/);
  
  parts.forEach(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      runs.push(new TextRun({
        text: boldText,
        bold: true,
        font: 'Arial',
        size: 20 // 10pt
      }));
    } else if (part.length > 0) {
      // Italic pattern: *text* or _text_ inside the normal part
      const italicParts = part.split(/(\*.*?\*)/);
      italicParts.forEach(iPart => {
        if (iPart.startsWith('*') && iPart.endsWith('*')) {
          const italicText = iPart.slice(1, -1);
          runs.push(new TextRun({
            text: italicText,
            italics: true,
            bold: forceBold,
            font: 'Arial',
            size: 20
          }));
        } else if (iPart.length > 0) {
          runs.push(new TextRun({
            text: iPart,
            bold: forceBold,
            font: 'Arial',
            size: 20
          }));
        }
      });
    }
  });

  return runs;
}

/**
 * Parses a cell content string (handling <br>, newlines, lists, bold)
 * and returns an array of docx Paragraphs
 */
function parseCellContent(cellText, isHeader = false, forceBold = false) {
  if (!cellText) return [new Paragraph({ children: [] })];
  
  // Split cell text by HTML line breaks or newlines
  const lines = cellText.split(/<br\s*\/?>|\n/gi).map(l => l.trim()).filter(l => l.length > 0);
  
  return lines.map(line => {
    let isBullet = false;
    let displayText = line;
    
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      isBullet = true;
      displayText = line.replace(/^[•\-*]\s*/, '');
    }
    
    const runs = parseInlineMarkdown(displayText, forceBold);
    
    return new Paragraph({
      children: runs,
      bullet: isBullet ? { level: 0 } : undefined,
      alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 40, after: 40 }
    });
  });
}

/**
 * Creates a docx Table from matrix data, automatically handling rowspans & colspans
 */
function createDocxTable(matrix, isPengalamanBelajar = false) {
  // Table 1 (Identitas/Desain): 3 cols -> [20%, 30%, 50%]
  // Table 2 (Pengalaman): 3 cols -> [15%, 25%, 60%]
  // Standard Rubric Table: N cols -> evenly split
  const numCols = matrix[0]?.length || 3;
  const colWidths = [];
  
  if (numCols === 3) {
    if (isPengalamanBelajar) {
      colWidths.push(15, 25, 60); // Pengalaman Belajar widths
    } else {
      colWidths.push(20, 30, 50); // Identitas / Desain / Asesmen widths
    }
  } else {
    // Rubric / others: split evenly
    const width = Math.floor(100 / numCols);
    for (let i = 0; i < numCols; i++) {
      colWidths.push(width);
    }
  }

  // Calculate vertical merges for Col 0 and Col 1
  const mergeMap = computeVerticalMerge(matrix, [0, 1]);
  
  const borderSetting = {
    top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 8, color: "000000" }
  };

  const rows = [];
  
  for (let rIdx = 0; rIdx < matrix.length; rIdx++) {
    const rowData = matrix[rIdx];
    const cells = [];
    
    // Check horizontal merge (Sintaks bar)
    // If cell 1 contains "Sintak" and equals cell 2 (or cell 2 is empty)
    let isSintaksRow = false;
    if (rowData.length >= 3) {
      const cell1Text = rowData[1]?.trim() || '';
      const cell2Text = rowData[2]?.trim() || '';
      if (cell1Text.startsWith('Sintak') && (cell1Text === cell2Text || cell2Text === '')) {
        isSintaksRow = true;
      }
    }
    
    for (let cIdx = 0; cIdx < rowData.length; cIdx++) {
      // Horizontal Merge skip
      if (isSintaksRow && cIdx === 2) {
        continue;
      }
      
      const cellText = rowData[cIdx];
      const vMerge = mergeMap[rIdx][cIdx]?.type;
      
      const cellParams = {
        borders: borderSetting,
        margins: { top: 120, bottom: 120, left: 180, right: 180 },
        width: {
          size: isSintaksRow && cIdx === 1 ? colWidths[1] + colWidths[2] : colWidths[cIdx],
          type: WidthType.PERCENTAGE
        }
      };

      // Apply vertical merge
      if (vMerge === 'restart') {
        cellParams.verticalMerge = VerticalMergeType.RESTART;
      } else if (vMerge === 'continue') {
        cellParams.verticalMerge = VerticalMergeType.CONTINUE;
      }

      // Special background styling
      // Gray shading for Sintaks headers
      if (isSintaksRow && cIdx === 1) {
        cellParams.shading = { fill: "F2F2F2" };
      }
      // Light background for parent categories
      if (cIdx === 0 && !vMerge) {
        cellParams.shading = { fill: "FAFAFA" };
      }

      // Generate cell paragraphs
      let children = [];
      if (vMerge === 'continue') {
        // If it's a continue merge, children must be empty for docx cell
        children = [];
      } else {
        const isHeader = isSintaksRow && cIdx === 1;
        const isParentLabel = cIdx === 0;
        
        children = parseCellContent(cellText, isHeader, isParentLabel);
      }

      cellParams.children = children;
      cells.push(new TableCell(cellParams));
    }
    
    rows.push(new TableRow({ children: cells }));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows
  });
}

/**
 * Main export function to generate and trigger download of the DOCX file
 */
export async function generateDocx(markdownText, docTitle) {
  const blocks = parseMarkdown(markdownText);
  const docChildren = [];
  
  // Parse document title if available
  let titleText = "PERENCANAAN PEMBELAJARAN";
  let subTitleText = docTitle || "Rencana Pelaksanaan Pembelajaran Mendalam";
  
  // Separate header fields (Satuan Pendidikan, Mata Pelajaran, Kelas, Alokasi Waktu)
  const headerFields = [];
  const bodyBlocks = [];
  
  // Extract top-level metadata from the beginning of the markdown
  let titleFound = false;
  blocks.forEach(block => {
    if (block.type === 'heading' && block.level === 1) {
      titleText = block.text.toUpperCase();
      titleFound = true;
    } else if (block.type === 'heading' && block.level === 2 && !titleFound) {
      subTitleText = block.text.toUpperCase();
    } else if (block.type === 'paragraph' && (
      block.text.toLowerCase().includes('satuan pendidikan:') || 
      block.text.toLowerCase().includes('mata pelajaran:') || 
      block.text.toLowerCase().includes('kelas / fase:') || 
      block.text.toLowerCase().includes('kelas/') ||
      block.text.toLowerCase().includes('alokasi waktu:')
    )) {
      headerFields.push(block.text);
    } else {
      bodyBlocks.push(block);
    }
  });

  // 1. Add Main centered Title
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: titleText,
          bold: true,
          font: 'Arial',
          size: 28, // 14pt
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 }
    })
  );

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: subTitleText,
          bold: true,
          font: 'Arial',
          size: 24, // 12pt
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 }
    })
  );

  // 2. Add header metadata fields
  headerFields.forEach(field => {
    const parts = field.split(':');
    const label = parts[0] + ':';
    const val = parts.slice(1).join(':');
    
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: label.padEnd(25, ' '), bold: true, font: 'Arial', size: 20 }),
          new TextRun({ text: val, font: 'Arial', size: 20 })
        ],
        spacing: { before: 60, after: 60 }
      })
    );
  });
  
  // Spacing separator
  docChildren.push(new Paragraph({ children: [], spacing: { before: 200, after: 200 } }));

  // 3. Add parsed tables and paragraphs
  bodyBlocks.forEach(block => {
    if (block.type === 'heading') {
      let level = HeadingLevel.HEADING_1;
      let size = 24; // 12pt
      
      if (block.level === 2) {
        level = HeadingLevel.HEADING_2;
        size = 22;
      } else if (block.level >= 3) {
        level = HeadingLevel.HEADING_3;
        size = 20;
      }

      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: block.text,
              bold: true,
              font: 'Arial',
              size: size
            })
          ],
          heading: level,
          spacing: { before: 240, after: 120 }
        })
      );
    } else if (block.type === 'paragraph') {
      const runs = parseInlineMarkdown(block.text);
      docChildren.push(
        new Paragraph({
          children: runs,
          spacing: { before: 120, after: 120 }
        })
      );
    } else if (block.type === 'table') {
      // Check if it's the Pengalaman Belajar table
      const isPengalamanTable = block.data.some(row => 
        row.some(cell => cell.toLowerCase().includes('pengalaman belajar'))
      );
      
      const docxTable = createDocxTable(block.data, isPengalamanTable);
      docChildren.push(docxTable);
      
      // Spacing after table
      docChildren.push(new Paragraph({ children: [], spacing: { before: 200, after: 200 } }));
    }
  });

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren
      }
    ]
  });

  // Build and trigger download
  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `RP_PM_${subTitleText.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
