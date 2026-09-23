const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "{currentView === 'form' && <AssessmentForm assessmentType={assessmentType} onSubmit={handleFormSubmit} />}",
  "{currentView === 'form' && <AssessmentForm assessmentType={assessmentType} onBack={() => setCurrentView('landing')} onSubmit={handleFormSubmit} />}"
);

app = app.replace(
  "{currentView === 'admin-login' && <AdminLogin onLogin={() => setCurrentView('admin-dashboard')} />}",
  "{currentView === 'admin-login' && <AdminLogin onBack={() => setCurrentView('landing')} onSuccess={() => setCurrentView('admin-dashboard')} />}"
);

app = app.replace(
  "{currentView === 'admin-dashboard' && <AdminDashboard />}",
  "{currentView === 'admin-dashboard' && <AdminDashboard onLogout={() => setCurrentView('admin-login')} onOpenCMS={() => setCurrentView('cms-dashboard')} />}"
);

app = app.replace(
  "{currentView === 'cms-dashboard' && <CMSDashboard />}",
  "{currentView === 'cms-dashboard' && <CMSDashboard onBack={() => setCurrentView('admin-dashboard')} />}"
);

fs.writeFileSync('src/App.tsx', app);
