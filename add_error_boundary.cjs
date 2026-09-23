const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const errorBoundaryClass = `
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h1>Sorry.. there was an error</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
`;

app = app.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\n" + errorBoundaryClass);

app = app.replace(
  "<LanguageProvider>",
  "<LanguageProvider>\n      <ErrorBoundary>"
);
app = app.replace(
  "</LanguageProvider>",
  "      </ErrorBoundary>\n    </LanguageProvider>"
);

fs.writeFileSync('src/App.tsx', app);
