const fs = require('fs');

const extendedDB = {
  forests: {
    '1': [
      { type: 'video', title: "1. What is a Forest?", vid: "https://www.youtube-nocookie.com/embed/al-do-HGuIk?autoplay=0" },
      { type: 'quiz', q: "Which layer of the soil contains the most humus?", opts: ["Bedrock", "Topsoil", "Subsoil"], ans: 1, exp: "Topsoil is rich in decaying organic matter (humus) making it fertile." }
    ],
    '2': [
      { type: 'video', title: "2. The Water Cycle", vid: "https://www.youtube-nocookie.com/embed/ncORPosM0RQ?autoplay=0" },
      { type: 'quiz', q: "How do forests contribute to the water cycle?", opts: ["By transpiring water vapor into the air", "By absorbing sunlight", "By producing rocks"], ans: 0, exp: "Trees absorb water from the soil and release it into the atmosphere via transpiration." }
    ],
    '3': [
      { type: 'video', title: "3. Deforestation", vid: "https://www.youtube-nocookie.com/embed/Ic-J6hcSKa8?autoplay=0" },
      { type: 'quiz', q: "What is a major consequence of deforestation?", opts: ["Increased biodiversity", "Loss of habitat and soil erosion", "Colder global temperatures"], ans: 1, exp: "Removing trees destroys animal habitats and leads to soil washing away." }
    ],
    '4': [
      { type: 'video', title: "4. Wildlife Food Chains", vid: "https://www.youtube-nocookie.com/embed/Cqwf2DplxyU?autoplay=0" },
      { type: 'quiz', q: "What happens if primary consumers are removed from a forest?", opts: ["Producers overgrow and predators starve", "Nothing changes", "The forest turns into a desert overnight"], ans: 0, exp: "Ecosystems are tightly linked. Herbivores keep plants in check and feed the predators." }
    ],
    '5': [
      { type: 'video', title: "5. The Forest Floor", vid: "https://www.youtube-nocookie.com/embed/bXvA4sA4iYI?autoplay=0" },
      { type: 'quiz', q: "Why is the forest floor dark?", opts: ["Because it is underground", "Because the canopy blocks most sunlight", "Because the dirt absorbs light magnetically"], ans: 1, exp: "The tall canopy traps light, meaning only shade-tolerant plants grow on the floor." }
    ],
    '6': [
      { type: 'video', title: "6. Seed Dispersal", vid: "https://www.youtube-nocookie.com/embed/im4HVXMGI68?autoplay=0" },
      { type: 'quiz', q: "How do fruits help trees reproduce?", opts: ["They feed the tree", "They attract animals who eat and scatter the seeds", "They look pretty to humans"], ans: 1, exp: "Animals eat fruits and excrete the seeds far away, spreading the tree's offspring." }
    ],
    '7': [
      { type: 'video', title: "7. Balance in Nature", vid: "https://www.youtube-nocookie.com/embed/if29mjcd5bc?autoplay=0" },
      { type: 'quiz', q: "Why are predators necessary in a forest?", opts: ["They prevent herbivores from destroying all plants", "They water the trees", "They are not necessary at all"], ans: 0, exp: "Predators maintain the balance by ensuring herbivore populations don't explode." }
    ],
    '8': [
      { type: 'video', title: "Boss Challenge: Ecosystem Master", vid: "https://www.youtube-nocookie.com/embed/m92o-yLq79U?autoplay=0" },
      { type: 'quiz', q: "In a forest, which of the following acts as the ultimate decomposer?", opts: ["Eagles", "Fungi and Bacteria", "Green Plants"], ans: 1, exp: "Fungi and bacteria break down dead matter, returning nutrients to the soil." },
      { type: 'quiz', q: "What role do green plants play?", opts: ["Producers", "Consumers", "Decomposers"], ans: 0, exp: "They produce their own food using sunlight." }
    ]
  },
  water: {},
  soil: {}
};

// Copy forests over to water and soil templates for speed but change titles
for(let i=1; i<=8; i++) {
   extendedDB.water[i] = JSON.parse(JSON.stringify(extendedDB.forests[i]));
   extendedDB.water[i][0].title = "Water Challenge " + i;
   extendedDB.water[i][1].q = "Is water conservation important? (Node " + i + ")";
   extendedDB.water[i][1].opts = ["Yes!", "No", "Maybe"];
   extendedDB.water[i][1].ans = 0;
   
   extendedDB.soil[i] = JSON.parse(JSON.stringify(extendedDB.forests[i]));
   extendedDB.soil[i][0].title = "Soil Challenge " + i;
   extendedDB.soil[i][1].q = "Does soil need nutrients? (Node " + i + ")";
   extendedDB.soil[i][1].opts = ["Yes!", "No", "Maybe"];
   extendedDB.soil[i][1].ans = 0;
}

const htmlFile = 'c:/Users/Aniket Ingale/Downloads/EcoQuest/frontend/lesson-play.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// Also update the finish logic to add the session storage key to trigger animation!
let newHtml = html.replace(/localStorage\.setItem\('ecoProgress', JSON\.stringify\(prog\)\);/, 
  "localStorage.setItem('ecoProgress', JSON.stringify(prog));\n    sessionStorage.setItem('justCompleted_' + lessonKey, nodeId);"
);

let dbStr = 'const DB = ' + JSON.stringify(extendedDB, null, 2) + ';';
newHtml = newHtml.replace(/const DB = \{[\s\S]*?\n\};/, dbStr);

fs.writeFileSync(htmlFile, newHtml);
console.log("DB Replaced and Session flag added to lesson-play.html");
