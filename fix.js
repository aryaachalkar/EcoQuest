const fs = require('fs');
['lesson-play.html', 'lesson-forests-detail.html', 'lesson-water-detail.html', 'lesson-soil-detail.html'].forEach(f => {
  let p = 'c:/Users/Aniket Ingale/Downloads/EcoQuest/frontend/'+f;
  if(fs.existsSync(p)) {
    let html = fs.readFileSync(p, 'utf8');
    let fixed = html.split('\\`').join('`').split('\\$').join('$');
    fs.writeFileSync(p, fixed);
    console.log('Fixed', f);
  }
});
