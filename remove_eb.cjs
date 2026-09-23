const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  /<ErrorBoundary>\s*/g, ''
).replace(
  /\s*<\/ErrorBoundary>/g, ''
);

// remove ErrorBoundary class definition
app = app.replace(/interface Props \{[\s\S]*?\}[\s\S]*?class ErrorBoundary extends Component<Props, State> \{[\s\S]*?\}\s*\}[\s\S]*?\}\s*/m, '');
// just replace the whole thing manually since regex can be brittle

fs.writeFileSync('src/App.tsx', app);
