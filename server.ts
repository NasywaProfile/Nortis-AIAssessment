import express from 'express';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadInitialSubmissions(): Map<string, any> {
  const map = new Map<string, any>();
  if (fs.existsSync(SUBMISSIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item && item.id) map.set(item.id, item);
        });
      }
    } catch (e) {
      console.warn('Failed reading submissions file:', e);
    }
  }
  return map;
}

function persistSubmissions(submissionsMap: Map<string, any>) {
  try {
    const list = Array.from(submissionsMap.values());
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed saving submissions to disk:', e);
  }
}

function loadCMS(): any {
  if (fs.existsSync(CMS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CMS_FILE, 'utf-8'));
    } catch (e) {
      console.warn('Failed reading CMS file:', e);
    }
  }
  return {};
}

function persistCMS(cmsData: any) {
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(cmsData, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed saving CMS to disk:', e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory store with disk backing
  const store = {
    submissions: loadInitialSubmissions(),
    cms: loadCMS()
  };

  // API Routes
  app.post('/api/submissions', (req, res) => {
    const data = req.body;
    const id = data.id || 'SUB-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newSub = { ...data, id, timestamp: data.timestamp || new Date().toISOString() };
    store.submissions.set(id, newSub);
    persistSubmissions(store.submissions);
    res.json({ success: true, id, submissionId: id });
  });

  app.get('/api/submissions', (req, res) => {
    // Return sorted newest first
    const list = Array.from(store.submissions.values()).sort((a: any, b: any) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });
    res.json({ success: true, data: list });
  });

  app.get('/api/submissions/:id', (req, res) => {
    const sub = store.submissions.get(req.params.id);
    if (sub) {
      res.json({ success: true, data: sub });
    } else {
      res.status(404).json({ success: false, error: 'Not found' });
    }
  });

  app.put('/api/submissions/:id', (req, res) => {
    const id = req.params.id;
    const existing = store.submissions.get(id);
    const updated = { ...(existing || {}), ...req.body, id };
    store.submissions.set(id, updated);
    persistSubmissions(store.submissions);
    res.json({ success: true, data: updated });
  });

  app.patch('/api/submissions/:id', (req, res) => {
    const id = req.params.id;
    const existing = store.submissions.get(id);
    const updated = { ...(existing || {}), ...req.body, id };
    store.submissions.set(id, updated);
    persistSubmissions(store.submissions);
    res.json({ success: true, data: updated });
  });

  app.delete('/api/submissions/:id', (req, res) => {
    store.submissions.delete(req.params.id);
    persistSubmissions(store.submissions);
    res.json({ success: true });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@nortis.ai' && password === 'password') {
      res.json({ success: true, token: 'local-token-admin' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  app.get('/api/cms', (req, res) => {
    res.json({ success: true, data: store.cms });
  });

  app.post('/api/cms', (req, res) => {
    store.cms = { ...store.cms, ...req.body };
    persistCMS(store.cms);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
