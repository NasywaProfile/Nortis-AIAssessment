const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "import React, { useState, useEffect } from 'react';\n\nimport React, { Component, ErrorInfo, ReactNode } from \"react\";",
  "import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';"
);

fs.writeFileSync('src/App.tsx', app);
