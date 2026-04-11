const fs = require('fs');

const generateNodes = (theme, title, emoji) => {
  let html = '';
  for(let i=1; i<=8; i++) {
    let extra = '';
    let lockLabel = '🔒';
    if(i===8) {
      lockLabel = '🎁';
      extra = 'style="background:var(--g-light);"';
    }
    
    html += `
      <!-- Node ${i} -->
      <div class="map-node-wrapper animate d4">
        <div class="map-node locked" id="node${i}" ${extra}>
          ${lockLabel}
          <div class="node-tooltip" id="tooltip${i}">
            <div class="tooltip-title" style="color:var(--g-muted);">${i}. ${title} Part ${i}</div>
            <div class="tooltip-sub" style="color:var(--g-muted);">Complete level ${i-1} to unlock this lesson.</div>
          </div>
        </div>
      </div>
    `;
  }
  return html;
};

const updateMap = (file, theme, title, emoji) => {
  let html = fs.readFileSync(file, 'utf8');
  
  let startIdx = html.indexOf('<div class="gamified-map-container">');
  
  // Find closing tag of gamified-map-container
  let closingIdx = html.indexOf('</div>\n\n  </div>\n</div>\n\n<script>');
  if(closingIdx === -1) closingIdx = html.indexOf('</div>\n\n  </div>\n</div>\n\n<!-- FULLSCREEN');
  if(closingIdx === -1) closingIdx = html.indexOf('</div>\n\n  </div>\n</div>');

  if(startIdx !== -1 && closingIdx !== -1) {
    let newNodes = `<div class="gamified-map-container">\n      <div class="map-path-line"></div>\n` + generateNodes(theme, title, emoji);
    html = html.slice(0, startIdx) + newNodes + html.slice(closingIdx);
    
    // Now replace the script
    let scriptStart = html.indexOf('<script>');
    let newScript = `
<script>
// Retrieve progress from localStorage
const prog = JSON.parse(localStorage.getItem('ecoProgress') || '{}')['${theme}'] || [];
const justCompleted = sessionStorage.getItem('justCompleted_${theme}');

document.addEventListener('DOMContentLoaded', () => {
  let highestUnlocked = 1;
  
  // Set basic states
  for(let i=1; i<=8; i++) {
    const node = document.getElementById('node' + i);
    const wrapper = node.parentElement;
    
    if (prog.includes(i.toString())) {
      node.className = 'map-node done';
      node.innerHTML = '${emoji}<div class="node-tooltip"><div class="tooltip-title">' + i + '. Lesson</div><div class="tooltip-sub">Completed!</div><button class="tooltip-btn done-btn" onclick="window.location.href=\\'lesson-play.html?lesson=${theme}&node=' + i + '\\'">Review Lesson</button></div>';
      highestUnlocked = Math.max(highestUnlocked, i+1);
    } else {
      node.className = 'map-node locked';
      if(i === 8) node.innerHTML = '🎁<div class="node-tooltip"><div class="tooltip-title">Final Challenge</div><div class="tooltip-sub">Locked.</div></div>';
      else node.innerHTML = '🔒<div class="node-tooltip"><div class="tooltip-title">' + i + '. Lesson</div><div class="tooltip-sub">Locked.</div></div>';
      
      node.onclick = () => alert('Complete previous level first!');
    }
  }
  
  // Handle un-animated unlocks
  if (highestUnlocked <= 8) {
    let unlNode = document.getElementById('node' + highestUnlocked);
    
    if (justCompleted && parseInt(justCompleted) === highestUnlocked - 1) {
      // It's the one we just unlocked! Animate it!
      unlNode.className = 'map-node locked animating'; // Keep it locked visually first
      
      // Clear the session storage flag
      sessionStorage.removeItem('justCompleted_${theme}');
      
      setTimeout(() => {
        unlNode.scrollIntoView({behavior: 'smooth', block: 'center'});
        
        setTimeout(() => {
          // Play unlock animation
          unlNode.className = 'map-node active unlock-bounce';
          unlNode.innerHTML = '⭐<div class="node-tooltip"><div class="tooltip-title">NEW! Lesson ' + highestUnlocked + '</div><div class="tooltip-sub">Ready to learn?</div><button class="tooltip-btn" onclick="window.location.href=\\'lesson-play.html?lesson=${theme}&node=' + highestUnlocked + '\\'">Start Lesson</button></div>';
          
          createMapConfetti(unlNode);
        }, 800);
      }, 500);
      
    } else {
      // Just normal active state without fancy animation
      unlNode.className = 'map-node active';
      unlNode.innerHTML = '⭐<div class="node-tooltip"><div class="tooltip-title">' + highestUnlocked + '. Lesson</div><div class="tooltip-sub">Ready to learn?</div><button class="tooltip-btn" onclick="window.location.href=\\'lesson-play.html?lesson=${theme}&node=' + highestUnlocked + '\\'">Start Lesson</button></div>';
    }
    
    // Important: Re-assign onclick to actually let the user play!
    unlNode.onclick = () => window.location.href = 'lesson-play.html?lesson=${theme}&node=' + highestUnlocked;
  } else if (highestUnlocked === 9 && justCompleted && parseInt(justCompleted) === 8) {
    // The user literally just finished the final node! Trigger massive chapter celebration!
    sessionStorage.removeItem('justCompleted_${theme}');
    setTimeout(showChapterCelebration, 500);
  }

  // Update Progress Bar
  const pct = Math.min(((highestUnlocked - 1) / 8) * 100, 100);
  document.getElementById('mainLevFill').style.width = pct + '%';
  document.querySelector('.lev-pts').textContent = (highestUnlocked - 1) + ' / 8 Nodes Completed';
});

function createMapConfetti(target) {
  const rect = target.getBoundingClientRect();
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.left = (rect.left + rect.width/2) + 'px';
    conf.style.top = (rect.top + rect.height/2) + 'px';
    conf.style.width = Math.random() * 8 + 4 + 'px';
    conf.style.height = Math.random() * 8 + 4 + 'px';
    conf.style.backgroundColor = ['#56c271', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)];
    conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    conf.style.pointerEvents = 'none';
    conf.style.zIndex = '9999';
    document.body.appendChild(conf);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 150 + 50;
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity - 100;

    conf.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: \`translate(\${endX}px, \${endY}px) rotate(\${Math.random()*720}deg)\`, opacity: 0 }
    ], {
      duration: 1000 + Math.random()*500,
      easing: 'cubic-bezier(.17,.89,.32,1)'
    });
    setTimeout(() => conf.remove(), 1500);
  }
}

function showChapterCelebration() {
  if (!localStorage.getItem('bonus_claimed_chapter_' + '${theme}')) {
     localStorage.setItem('bonus_claimed_chapter_' + '${theme}', 'true');
     let currentXP = parseInt(localStorage.getItem('ecoXP') || '1240');
     localStorage.setItem('ecoXP', currentXP + 500);
  }

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(13, 31, 15, 0.9)';
  overlay.style.zIndex = '100000';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.5s ease-in';
  
  overlay.innerHTML = \`
    <div style="font-size: 150px; filter: drop-shadow(0 0 40px #f59e0b); animation: masterBounce 2s infinite;">🏆</div>
    <h1 style="color: #56c271; font-family: var(--font-d); font-size: 54px; margin-top: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align:center;">CHAPTER MASTERED!</h1>
    <p style="color: #e8f5e9; font-size: 20px; margin: 15px 0 40px 0; max-width: 600px; text-align: center; line-height: 1.5;">You successfully mapped the entire path and proved your ecological mastery.</p>
    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 10px 30px; border-radius: 30px; font-weight: bold; color: #fff; font-size: 24px; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);">+500 Bonus XP</div>
    <button onclick="this.parentElement.style.opacity='0'; setTimeout(()=>this.parentElement.remove(), 500);" style="margin-top: 40px; background: #56c271; color: #fff; font-weight: bold; padding: 18px 50px; font-size: 20px; border-radius: 12px; border: none; cursor: pointer; text-transform: uppercase; box-shadow: 0 6px 0 #2d7a38;">Claim Reward</button>
  \`;
  
  document.body.appendChild(overlay);
  
  // Fade in
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });

  // Continuous Confetti bursts
  let bursts = 0;
  const burstInterval = setInterval(() => {
    const dummyTarget = document.createElement('div');
    dummyTarget.style.position = 'fixed';
    dummyTarget.style.left = Math.random() * 80 + 10 + 'vw';
    dummyTarget.style.top = Math.random() * 50 + 20 + 'vh';
    dummyTarget.style.width = '1px';
    dummyTarget.style.height = '1px';
    document.body.appendChild(dummyTarget);
    createMapConfetti(dummyTarget);
    dummyTarget.remove();
    
    bursts++;
    if (bursts > 8) clearInterval(burstInterval); // stop after 4 seconds
  }, 400);
}
</script>
<style>
  @keyframes unlockBounce {
    0% { transform: scale(1); box-shadow: 0 0 0 rgba(86,194,113,0); }
    50% { transform: scale(1.3); box-shadow: 0 0 40px rgba(86,194,113,0.8); background-color: #dcfce7; }
    100% { transform: scale(1); box-shadow: 0 0 20px rgba(86,194,113,0.4); }
  }
  @keyframes masterBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.1); }
  }
  .unlock-bounce {
    animation: unlockBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
</style>
`;
    html = html.slice(0, scriptStart) + newScript;
    
    // Remove trailing tags to make it clean since we dumped until end of script
    if (html.indexOf('</html>') === -1) {
      html += '\n</body>\n</html>';
    }
    
    fs.writeFileSync(file, html);
    console.log('Updated ' + file);
  } else {
    console.error('Failed to find markers in ' + file);
  }
};

updateMap('c:/Users/Aniket Ingale/Downloads/EcoQuest/frontend/lesson-forests-detail.html', 'forests', 'Forests', '🌳');
updateMap('c:/Users/Aniket Ingale/Downloads/EcoQuest/frontend/lesson-water-detail.html', 'water', 'Water Basics', '💧');
updateMap('c:/Users/Aniket Ingale/Downloads/EcoQuest/frontend/lesson-soil-detail.html', 'soil', 'Soil Matters', '🌱');
