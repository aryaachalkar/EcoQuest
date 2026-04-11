const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend');
const page2 = fs.readFileSync(path.join(dir, 'page2.html'), 'utf8');
const tasksHTML = fs.readFileSync(path.join(dir, 'tasks.html'), 'utf8');

// ==== Create profile.html ====
let profContentStr = `
  <header class="topbar">
    <div>
      <div class="topbar-title">My Profile</div>
      <div class="topbar-sub">Manage your account and view your progress</div>
    </div>
    <div class="topbar-right">
      <button class="tb-btn primary" onclick="window.location.href='tasks-upload.html'">
        Upload Proof
      </button>
    </div>
  </header>
  <div class="content">
    <div class="rules-box animate d1" style="max-width: 600px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; padding: 3rem 2rem;">
      <div id="profAvatar" style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #2d7a38, #56c271); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 500; color: #fff; margin-bottom: 1rem; font-family: var(--font-d);">??</div>
      <h2 id="profName" style="font-family: var(--font-d); font-size: 26px; color: var(--g-text); margin-bottom: 4px;">Loading...</h2>
      <p id="profSchool" style="font-size: 14px; color: var(--g-muted); margin-bottom: 1.5rem;">Loading...</p>
      
      <div style="background: #f0fdf4; border: 1px solid #c8dcc8; border-radius: var(--r-md); padding: 1.25rem; width: 100%; margin-bottom: 2rem; display: flex; justify-content: space-around;">
        <div>
          <div style="font-size: 11px; color: var(--g-sub); text-transform: uppercase; letter-spacing: 0.5px;">Eco Points</div>
          <div id="profPts" style="font-family: var(--font-d); font-size: 24px; color: var(--g-mid);">--</div>
        </div>
        <div style="width: 1px; background: #c8dcc8;"></div>
        <div>
          <div style="font-size: 11px; color: var(--g-sub); text-transform: uppercase; letter-spacing: 0.5px;">Role</div>
          <div id="profRole" style="font-family: var(--font-d); font-size: 24px; color: var(--g-mid); text-transform: capitalize;">--</div>
        </div>
      </div>

      <button id="logoutBtn" style="padding: 12px 24px; border-radius: var(--r-sm); background: #ef4444; color: #fff; font-family: var(--font-b); font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: all var(--ease); width: 100%;">
        Log Out
      </button>
    </div>
  </div>
`;

let profileHTML = page2.replace(/<header class="topbar">[\s\S]*?<\/div>\s*<\/div>\s*<script>/i, profContentStr + '\n</div>\n<script>');
// Set active state in sidebar correctly
profileHTML = profileHTML.replace(/<button class="nav-item active([^>]*)>/g, '<button class="nav-item">');
// Note: Profile button already has onclick from fix_links. We need to add active.
// Replace the one linking to profile.html with active
profileHTML = profileHTML.replace(/<button class="nav-item" onclick="window\.location\.href='profile\.html'">/g, '<button class="nav-item active" onclick="window.location.href=\'profile.html\'">');
fs.writeFileSync(path.join(dir, 'profile.html'), profileHTML);


// ==== Create ngo-tasks.html ====
// Extract ngo tasks from tasks.html
let ngoSectionMatch = tasksHTML.match(/<div class="ngo-section animate d4">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<script>)/i);
let ngoHtmlString = ngoSectionMatch ? ngoSectionMatch[0] : '';
// Remove the 'd4' delay so it animates immediately
ngoHtmlString = ngoHtmlString.replace('animate d4', 'animate d1');

let ngoContentStr = `
  <header class="topbar">
    <div>
      <div class="topbar-title">Community & NGO Challenge Tasks</div>
      <div class="topbar-sub">Partner with real NGOs — earn 2× bonus points for community action</div>
    </div>
    <div class="topbar-right">
      <button class="tb-btn primary" onclick="window.location.href='tasks-upload.html'">
        Upload Proof
      </button>
    </div>
  </header>
  <div class="content">
    ${ngoHtmlString}
    </div>
  </div>
`;

let ngoPageHTML = tasksHTML.replace(/<header class="topbar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<script>/ig, ngoContentStr + '\n<script>');
// Set active state in sidebar correctly
ngoPageHTML = ngoPageHTML.replace(/<button class="nav-item active([^>]*)>/g, '<button class="nav-item">');
// Replace the one linking to ngo-tasks.html with active
ngoPageHTML = ngoPageHTML.replace(/<button class="nav-item" onclick="window\.location\.href='ngo-tasks\.html'">/g, '<button class="nav-item active" onclick="window.location.href=\'ngo-tasks.html\'">');
fs.writeFileSync(path.join(dir, 'ngo-tasks.html'), ngoPageHTML);

console.log('Created missing pages!');
