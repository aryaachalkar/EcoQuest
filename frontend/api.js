// API Utility for EcoQuest
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'page1.html';
    return null;
  }
  return token;
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'page1.html';
}

// Attach logic on page load
document.addEventListener('DOMContentLoaded', async () => {
    const token = requireAuth();
    if (!token) return;

    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch {
        handleLogout();
    }

    // ─── 1. GLOBAL UI UPDATES ───
    // Update Sidebar User Profile
    document.querySelectorAll('.sb-user-name').forEach(el => {
        el.textContent = `${user.firstName} ${user.lastName}`;
    });
    document.querySelectorAll('.sb-user-class').forEach(el => {
        el.textContent = `Class ${user.classStandard} · ${user.schoolName}`;
    });
    // Update Sidebar Avatar
    document.querySelectorAll('.sb-avatar').forEach(el => {
        el.textContent = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    });
    
    // Add Logout Button
    const navs = document.querySelectorAll('.sb-nav');
    if (navs.length > 0 && !document.getElementById('logout-btn')) {
        const logoutHtml = `
        <div class="nav-label" style="margin-top:1rem;">Session</div>
        <button class="nav-item" id="logout-btn" style="color: #ef4444;">
          <svg viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Logout
        </button>
        `;
        navs[0].insertAdjacentHTML('beforeend', logoutHtml);
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }

    // ─── 2. DASHBOARD (page2.html) SPECIFIC ───
    if (window.location.pathname.endsWith('page2.html')) {
        // Topbar Greeting
        const greeting = document.querySelector('.topbar-greeting');
        if (greeting) {
            const hour = new Date().getHours();
            const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            greeting.textContent = `${timeGreeting}, ${user.firstName}!`;
        }
        
        // Fetch fresh stats from backend
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                // Update User points in local storage to stay in sync
                user.totalPoints = data.user.totalPoints;
                localStorage.setItem('user', JSON.stringify(user));

                // Update UI Points
                const xpValues = document.querySelectorAll('.xp-val, .stat-val');
                if (xpValues[0]) xpValues[0].textContent = user.totalPoints; // Hero Ring
                if (xpValues[1]) xpValues[1].textContent = user.totalPoints; // Stat Card 1
                
                // Update specific stat cards (assuming order from HTML)
                if (xpValues[2]) xpValues[2].textContent = `${data.stats.quizzesCompleted}/9`; // Quizzes/Lessons
                if (xpValues[3]) xpValues[3].textContent = `#${data.stats.rank}`; // Rank
                if (xpValues[4]) xpValues[4].textContent = data.stats.tasksCompleted; // Tasks Done
                
                // Leaderboard block
                const youRankBlock = document.querySelector('.lb-you .lb-rank');
                if (youRankBlock) youRankBlock.textContent = data.stats.rank;
                const youNameBlock = document.querySelector('.lb-you .lb-info-name');
                if (youNameBlock) youNameBlock.innerHTML = `${user.firstName} ${user.lastName.charAt(0)}. <span style="font-size:10px;color:#2d7a38;background:#eaf3de;padding:1px 7px;border-radius:8px;margin-left:4px;">You</span>`;
                const youSchoolBlock = document.querySelector('.lb-you .lb-info-school');
                if (youSchoolBlock) youSchoolBlock.textContent = `Class ${user.classStandard} · ${user.schoolName}`;
                const youPtsBlock = document.querySelector('.lb-you .lb-pts-badge');
                if (youPtsBlock) youPtsBlock.textContent = `${user.totalPoints} pts`;
            }
        } catch (err) {
            console.error('Failed to fetch user stats', err);
        }
    }

    // ─── 3. LEADERBOARD (ecoquest-leaderboard.html) SPECIFIC ───
    if (window.location.pathname.endsWith('ecoquest-leaderboard.html')) {
        try {
            const res = await fetch(`${API_URL}/users/leaderboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success && data.leaderboard) {
                // Update Top 3 Podium
                const podiums = document.querySelectorAll('.podium-stage .podium-person');
                const lb = data.leaderboard;
                
                // Rank 2 (left)
                if (lb[1] && podiums[0]) {
                    podiums[0].querySelector('.pa-avatar').innerHTML = `${lb[1].firstName.charAt(0)}${lb[1].lastName.charAt(0)} <div class="pa-medal silver">2</div>`;
                    podiums[0].querySelector('.pa-name').textContent = `${lb[1].firstName} ${lb[1].lastName.charAt(0)}.`;
                    podiums[0].querySelector('.pa-pts').textContent = `${lb[1].totalPoints} pts`;
                }
                
                // Rank 1 (center)
                if (lb[0] && podiums[1]) {
                    podiums[1].querySelector('.pa-avatar').innerHTML = `<span class="pa-crown">👑</span> ${lb[0].firstName.charAt(0)}${lb[0].lastName.charAt(0)} <div class="pa-medal gold">1</div>`;
                    podiums[1].querySelector('.pa-name').textContent = `${lb[0].firstName} ${lb[0].lastName.charAt(0)}.`;
                    podiums[1].querySelector('.pa-pts').textContent = `${lb[0].totalPoints} pts`;
                }
                
                // Rank 3 (right)
                if (lb[2] && podiums[2]) {
                    podiums[2].querySelector('.pa-avatar').innerHTML = `${lb[2].firstName.charAt(0)}${lb[2].lastName.charAt(0)} <div class="pa-medal bronze">3</div>`;
                    podiums[2].querySelector('.pa-name').textContent = `${lb[2].firstName} ${lb[2].lastName.charAt(0)}.`;
                    podiums[2].querySelector('.pa-pts').textContent = `${lb[2].totalPoints} pts`;
                }

                // Update List
                const body = document.getElementById('rankingsBody');
                if (body) {
                    body.innerHTML = '';
                    lb.forEach((member, index) => {
                        const rank = index + 1;
                        const isYou = member._id === user.id || member.email === user.email; // Fallback comparison
                        
                        let rankClass = '';
                        if (rank === 1) rankClass = 'gold';
                        else if (rank === 2) rankClass = 'silver';
                        else if (rank === 3) rankClass = 'bronze';
                        
                        const rowHtml = `
                        <div class="rank-row ${isYou ? 'you' : ''} ${rank <= 3 ? 'top3' : ''}" data-name="${member.firstName} ${member.lastName}">
                          <div class="rr-rank ${rankClass}">${rank <= 3 ? (rank === 1 ? '🥇 ' : rank === 2 ? '🥈 ' : '🥉 ') : ''}${rank}</div>
                          <div class="rr-student">
                            <div class="rr-avatar" style="background:#56c271;color:#fff;">${member.firstName.charAt(0)}${member.lastName.charAt(0)}</div>
                            <div class="rr-info">
                              <div class="rr-name">${member.firstName} ${member.lastName.charAt(0)}.${isYou ? ' <span style="font-size:10px;color:#2d7a38;background:#eaf3de;padding:1px 7px;border-radius:8px;">You</span>' : ''}</div>
                              <div class="rr-school">Class ${member.classStandard} · ${member.schoolName}</div>
                            </div>
                          </div>
                          <div class="rr-pts">${member.totalPoints}</div>
                          <div class="rr-lessons">${Math.floor(member.totalPoints / 100)}</div>
                          <div class="rr-tasks">${Math.floor(member.totalPoints / 150)}</div>
                          <div class="rr-trend ${isYou ? 'up' : 'neutral'}">${isYou ? '↑' : '-'}</div>
                        </div>
                        `;
                        body.insertAdjacentHTML('beforeend', rowHtml);
                    });
                }
            }
        } catch (err) {
            console.error('Failed to fetch Leaderboard stats', err);
        }
    }

    // ─── 4. PROFILE (profile.html) SPECIFIC ───
    if (window.location.pathname.endsWith('profile.html')) {
        const profName = document.getElementById('profName');
        const profSchool = document.getElementById('profSchool');
        const profPts = document.getElementById('profPts');
        const profRole = document.getElementById('profRole');
        const profAvatar = document.getElementById('profAvatar');
        const logoutBtn = document.getElementById('logoutBtn');
        const profQuizzes = document.getElementById('profQuizzes');
        const profTasks = document.getElementById('profTasks');

        if (profName) profName.textContent = `${user.firstName} ${user.lastName}`;
        if (profSchool) profSchool.textContent = `Class ${user.classStandard} · ${user.schoolName}`;
        if (profPts) profPts.textContent = `${user.totalPoints}`;
        if (profRole) profRole.textContent = user.role || 'student';
        if (profAvatar) profAvatar.textContent = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
        
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                if (profPts) profPts.textContent = `${data.user.totalPoints}`;
                if (profQuizzes) profQuizzes.textContent = `${data.stats.quizzesCompleted}`;
                if (profTasks) profTasks.textContent = `${data.stats.tasksCompleted}`;
                
                // Dynamic level calculation
                const levelBars = document.querySelector('.level-bar-fill');
                const levelHeader = document.querySelector('.level-header span:nth-child(2)');
                if (levelBars && levelHeader) {
                    let lvl = 1, currentXP = data.user.totalPoints;
                    if (currentXP > 1000) lvl = 5;
                    else if (currentXP > 600) lvl = 4;
                    else if (currentXP > 300) lvl = 3;
                    else if (currentXP > 100) lvl = 2;
                    
                    let nextP = 100;
                    if (lvl === 2) nextP = 300;
                    if (lvl === 3) nextP = 600;
                    if (lvl === 4) nextP = 1000;
                    
                    if (lvl === 5) {
                        levelBars.style.width = '100%';
                        levelHeader.textContent = `${currentXP} / MAX XP`;
                    } else {
                        let percent = Math.min(100, Math.floor((currentXP / nextP) * 100));
                        levelBars.style.width = `${percent}%`;
                        levelHeader.textContent = `${currentXP} / ${nextP} XP`;
                    }
                    
                    const passLevelBadge = document.querySelector('.pass-badge');
                    if (passLevelBadge) passLevelBadge.textContent = `Lvl ${lvl}`;
                }
            }
        } catch (err) {}
    }

    // ─── 5. GLOBAL BUTTON ROUTING (TINY DETAILS) ───
    
    // Dashboard Hero Buttons
    document.querySelectorAll('.h-btn.solid').forEach(b => b.addEventListener('click', () => window.location.href = 'page3.html'));
    document.querySelectorAll('.h-btn.outline').forEach(b => b.addEventListener('click', () => window.location.href = 'page4.html'));
    
    // Task Start Buttons -> route to Upload Proof
    document.querySelectorAll('.ft-btn.solid, .tc-action.start, .topbar-right .tb-btn.primary:not([onclick])').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'tasks-upload.html';
        });
    });

    // NGO Accept Buttons -> route to NGO Portal
    document.querySelectorAll('.ngo-accept-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'ngo-detail.html';
        });
    });
    
    // Future / Preview Tasks
    document.querySelectorAll('.tc-action.view').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('This task will fully unlock next month! Keep checking back to participate.');
        });
    });
    
    // Locked Tasks
    document.querySelectorAll('.tc-action.locked-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('🔒 This task is locked. Wait for the festival month or complete previous tasks to unlock it!');
        });
    });
});
