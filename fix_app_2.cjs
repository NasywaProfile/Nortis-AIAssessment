const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "class ErrorBoundary extends React.Component<Props, State> {",
  "class ErrorBoundary extends React.Component<Props, State> {\n  constructor(props: Props) {\n    super(props);\n    this.state = { hasError: false, error: null, errorInfo: null };\n  }"
);
fs.writeFileSync('src/App.tsx', app);
