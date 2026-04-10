const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'page1.html');

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    content = content.replace(/class="nav-item""/g, 'class="nav-item"');
    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Fixed quotes in navigation');
