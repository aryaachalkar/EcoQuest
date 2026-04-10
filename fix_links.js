const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend');
if (!fs.existsSync(dir)) {
    console.log("No frontend dir");
    process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Fix double quotes
    content = content.replace(/class="([^"]*)""/g, 'class="$1"');

    // Add onclick to NGO Tasks
    // Match <button class="nav-item..."> ... NGO Tasks
    let btnRegex = /<button class="(nav-item|nav-item active)"(?!.*onclick)[^>]*>([\s\S]*?NGO Tasks[\s\S]*?)(?=<\/button>)/gi;
    content = content.replace(btnRegex, (match, cls, inner) => {
        return `<button class="${cls}" onclick="window.location.href='ngo-tasks.html'">${inner}`;
    });

    // Add onclick to Profile
    let profRegex = /<button class="(nav-item|nav-item active)"(?!.*onclick)[^>]*>([\s\S]*?Profile[\s\S]*?)(?=<\/button>)/gi;
    content = content.replace(profRegex, (match, cls, inner) => {
        return `<button class="${cls}" onclick="window.location.href='profile.html'">${inner}`;
    });

    // Also Profile button usually doesn't have a badge, but if it does grab it up to </button> -> wait, my regex matched up to (?=<\/button>) which is perfect.

    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Fixed navigation links');
