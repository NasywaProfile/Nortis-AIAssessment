const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "class ErrorBoundary extends React.Component<Props, State> {\n  constructor(props: Props) {\n    super(props);\n    this.state = { hasError: false, error: null, errorInfo: null };\n  }\n  public state: State = {\n    hasError: false,\n    error: null,\n    errorInfo: null\n  };",
  "class ErrorBoundary extends React.Component<Props, State> {\n  constructor(props: Props) {\n    super(props);\n    this.state = { hasError: false, error: null, errorInfo: null };\n  }"
);
fs.writeFileSync('src/App.tsx', app);

let pdf = fs.readFileSync('src/utils/individualPdfExport.ts', 'utf8');
pdf = pdf.replace(
  "addText(dim.score.toFixed(2), marginLeft + contentWidth - 10, currentY + 8, 'helvetica', 'bold', 12, primaryGreen, { align: 'right' } as any);",
  "doc.setFont('helvetica', 'bold');\n    doc.setFontSize(12);\n    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);"
);
fs.writeFileSync('src/utils/individualPdfExport.ts', pdf);

