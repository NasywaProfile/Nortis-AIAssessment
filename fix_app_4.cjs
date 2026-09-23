const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  "class ErrorBoundary extends React.Component<Props, State> {",
  "class ErrorBoundary extends Component<Props, State> {"
);
fs.writeFileSync('src/App.tsx', app);
