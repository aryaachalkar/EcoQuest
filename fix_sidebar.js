const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const getSidebar = (activeFilename) => `
<aside class="sidebar">
  <div class="sb-brand">
    <div class="sb-logo">
      <svg viewBox="0 0 22 22" fill="none"><path d="M11 2C11 2 4 7 4 13a7 7 0 0014 0C18 7 11 2 11 2z" fill="white" opacity="0.92"/><path d="M11 8v8M8.5 14c1-2 2.5-3 2.5-3" stroke="#2d7a38" stroke-width="1.4" stroke-linecap="round"/></svg>
    </div>
    <div>
      <div class="sb-name">EcoQuest</div>
      <div class="sb-tagline">Eco Learning</div>
    </div>
  </div>

  <nav class="sb-nav">
    <div class="nav-label">Main</div>
    <button class="nav-item \${activeFilename === 'page2.html' ? 'active' : ''}" onclick="window.location.href='page2.html'">
      <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/></svg>
      Dashboard
    </button>
    <button class="nav-item \${(activeFilename === 'page3.html' || activeFilename === 'lesson-forests-detail.html') ? 'active' : ''}" onclick="window.location.href='page3.html'">
      <svg viewBox="0 0 16 16" fill="none"><path d="M2 2h8l4 4v8H2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 2v4h4M5 8h6M5 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      Lessons
    </button>
    <button class="nav-item \${activeFilename === 'page4.html' ? 'active' : ''}" onclick="window.location.href='page4.html'">
      <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/><path d="M6.5 6C6.5 5.17 7.17 4.5 8 4.5s1.5.67 1.5 1.5c0 1-1.5 1.5-1.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/></svg>
      Quizzes
    </button>
    <button class="nav-item \${activeFilename === 'tasks.html' ? 'active' : ''}" onclick="window.location.href='tasks.html'">
      <svg viewBox="0 0 16 16" fill="none"><path d="M13 3H3a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1z" stroke="currentColor" stroke-width="1.3"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Tasks
    </button>

    <div class="nav-label" style="margin-top:1rem;">Community</div>
    <button class="nav-item \${activeFilename === 'ecoquest-leaderboard.html' ? 'active' : ''}" onclick="window.location.href='ecoquest-leaderboard.html'">
      <svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4h4l-3.5 2.5 1.5 4L8 10l-3.5 2.5 1.5-4L2 6h4z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
      Leaderboard
    </button>
    <button class="nav-item \${activeFilename === 'ngo-tasks.html' ? 'active' : ''}" onclick="window.location.href='ngo-tasks.html'">
      <svg viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="11" cy="5" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M1 14c0-2.2 1.8-4 4-4M10 14c0-2.2 1.8-4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      NGO Tasks
      <span class="nav-badge" style="background:#f59e0b;">2</span>
    </button>

    <div class="nav-label" style="margin-top:1rem;">My Account</div>
    <button class="nav-item \${activeFilename === 'tasks-upload.html' ? 'active' : ''}" onclick="window.location.href='tasks-upload.html'">
      <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.3"/></svg>
      Upload Proof
    </button>
    <button class="nav-item \${activeFilename === 'profile.html' ? 'active' : ''}" onclick="window.location.href='profile.html'">
      <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      Profile
    </button>
  </nav>

  <div class="sb-user">
    <div class="sb-avatar">..</div>
    <div>
      <div class="sb-user-name">Loading...</div>
      <div class="sb-user-class">Loading...</div>
    </div>
  </div>
</aside>
`.trim().replace(/class="nav-item "/g, 'class="nav-item"'); // Clean up empty class spaces

files.forEach(file => {
    // Only apply to files that HAVE a sidebar
    if (file === 'page1.html') return; 
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace everything between <aside class="sidebar"> and </aside>
    const newSidebar = getSidebar(file);
    content = content.replace(/<aside class="sidebar">[\s\S]*?<\/aside>/, newSidebar);
    
    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Successfully fixed sidebars for all pages.');
