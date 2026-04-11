const fs = require('fs');
const path = require('path');

const mobileCSS = `
  /* ═══════════════════════════════════
     MOBILE RESPONSIVE STYLES
  ═══════════════════════════════════ */

  /* Hamburger Menu Button */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #7a9a7c;
  }
  .mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 98;
  }
  .mobile-overlay.open { display: block; }

  @media (max-width: 900px) {
    /* Layout */
    body { display: block !important; }
    body > div[style*="display:flex"], body > div[style*="min-height:100vh"] { display: block !important; }

    /* Sidebar becomes a slide-in drawer */
    .sidebar {
      position: fixed !important;
      top: 0; left: -260px;
      width: 240px !important;
      height: 100vh !important;
      z-index: 99;
      transition: left 0.3s ease;
      overflow-y: auto;
      display: flex !important;
      flex-direction: column !important;
    }
    .sidebar.open { left: 0 !important; }

    /* Hamburger visible */
    .mobile-menu-btn { display: flex !important; align-items: center; }

    /* Main takes full width */
    .main { width: 100% !important; margin-left: 0 !important; }

    /* Topbar */
    .topbar { padding: 0 1rem !important; gap: 8px; }
    .topbar-title { font-size: 16px !important; }
    .topbar-sub { display: none; }
    .xp-pill { font-size: 12px !important; padding: 4px 10px !important; }
    .tb-btn span { display: none; }

    /* Content padding */
    .content { padding: 1rem !important; }

    /* Hero Banner */
    .hero-banner {
      flex-direction: column !important;
      padding: 1.25rem !important;
      gap: 1.25rem;
    }
    .hero-left, .hero-right { width: 100% !important; }
    .hero-right { display: flex !important; justify-content: center; margin-top: 0; }
    .hero-title { font-size: 22px !important; }
    .hero-sub { font-size: 13px !important; }
    .hero-actions { flex-direction: column !important; }
    .hero-actions .h-btn { width: 100% !important; text-align: center; }
    .hero-stat-box { padding: 0.75rem !important; }
    .hero-stat-val { font-size: 20px !important; }
    .hero-right { flex-direction: row !important; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }

    /* Stat cards */
    .stats-row { grid-template-columns: 1fr 1fr !important; }

    /* Lessons grid */
    .lessons-grid { grid-template-columns: 1fr !important; }

    /* Two-column layouts */
    .two-col, .fc-leaderboard { grid-template-columns: 1fr !important; gap: 1rem; }

    /* Leaderboard */
    .lb-top3 { gap: 8px !important; }
    .lb-list .lb-row { padding: 0.6rem 0.75rem !important; }

    /* Section heads */
    .section-head { flex-direction: column !important; align-items: flex-start !important; gap: 8px; }
    .section-title { font-size: 16px !important; }

    /* Grade switcher */
    .grade-switcher { flex-wrap: wrap !important; justify-content: center; }
    .grade-tab { font-size: 12px !important; padding: 7px 12px !important; }

    /* Featured lesson card */
    .featured-lesson { flex-direction: column !important; padding: 1.25rem !important; }

    /* Journey maps */
    .map-container { padding: 1rem 0.5rem !important; min-width: unset !important; }
    .journey-path { min-height: 300px !important; }

    /* Task chips */
    .task-chips { flex-direction: column !important; }
    .task-chip { min-width: unset !important; }

    /* Festival calendar */
    .fc-row { flex-direction: column !important; }
    .fc-leaderboard { display: block !important; }

    /* Profile / upload */
    .multi-upload-row { grid-template-columns: 1fr !important; }
    .pts-preview-bar { flex-direction: column !important; gap: 1rem; }
    .pts-breakdown { justify-content: center; }

    /* Progress bar steps */
    .progress-bar-wrap { overflow-x: auto; gap: 4px !important; }

    /* XP Ring shrink */
    .xp-ring { width: 100px !important; height: 100px !important; }
    .xp-val { font-size: 22px !important; }

    /* Topbar right: hide text for space */
    .tb-btn:not(.primary) { display: none !important; }
    .tb-notif { display: none !important; }
  }

  @media (max-width: 600px) {
    /* Stat cards single col */
    .stats-row { grid-template-columns: 1fr !important; }
    .lb-top3 { flex-direction: column !important; align-items: center; }
    .lb-podium { width: 100%; max-width: 200px; }
    .hero-title { font-size: 20px !important; }
    .section-head { flex-wrap: wrap; }
    .f-metrics { grid-template-columns: 1fr 1fr !important; }

    /* Topbar crunch */
    .topbar-left { gap: 6px; }
    .topbar-title { font-size: 14px !important; }

    /* NGO / detail pages */
    .ngo-hero { flex-direction: column !important; }
    .ngo-hero-left, .ngo-hero-right { width: 100% !important; }
    .impact-stats { flex-direction: column !important; gap: 0.5rem; }
    .task-status-row { flex-direction: column !important; gap: 0.5rem; }

    /* Journey node sizes */
    .map-node { width: 48px !important; height: 48px !important; }
    .node-icon { font-size: 18px !important; }
  }
`;

const dir = path.join('c:\\\\Users\\\\Aniket Ingale\\\\Downloads\\\\EcoQuest\\\\frontend');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let updated = 0;
files.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  // Skip if already injected
  if (content.includes('MOBILE RESPONSIVE STYLES')) {
    console.log('Skipped (already has mobile CSS):', file);
    return;
  }

  // Find </style> and inject before it
  if (content.includes('</style>')) {
    const lastStyle = content.lastIndexOf('</style>');
    content = content.slice(0, lastStyle) + mobileCSS + '\n</style>' + content.slice(lastStyle + 8);

    // Also inject hamburger button HTML into the topbar if it exists
    if (content.includes('class="topbar-left"') && !content.includes('mobile-menu-btn')) {
      content = content.replace(
        '<div class="topbar-left">',
        `<div class="topbar-left">
      <button class="mobile-menu-btn" id="mobileMenuBtn" onclick="toggleSidebar()" aria-label="Open menu">
        <svg viewBox="0 0 20 20" width="22" height="22" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>`
      );
    }

    // Inject mobile overlay & JS at end of body if not present
    if (!content.includes('mobile-overlay')) {
      const bodyClose = content.lastIndexOf('</body>');
      const mobileJS = `
<div class="mobile-overlay" id="mobileOverlay" onclick="toggleSidebar()"></div>
<script>
function toggleSidebar() {
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('mobileOverlay');
  if (sb) sb.classList.toggle('open');
  if (ov) ov.classList.toggle('open');
}
</script>
`;
      content = content.slice(0, bodyClose) + mobileJS + content.slice(bodyClose);
    }

    fs.writeFileSync(filepath, content, 'utf8');
    updated++;
    console.log('Updated:', file);
  } else {
    console.log('No </style> found in:', file);
  }
});

console.log(`\nDone! Updated ${updated} files.`);
