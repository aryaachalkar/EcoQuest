const fs = require('fs');

const realDB = {
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
  water: {
    '1': [
      { type: 'video', title: "1. Water Basics", vid: "https://www.youtube-nocookie.com/embed/OaEszE-iK04?autoplay=0" },
      { type: 'quiz', q: "Why is water called a universal solvent?", opts: ["It freezes fast", "It dissolves more substances than any other liquid", "It is always visible"], ans: 1, exp: "Water's chemical composition allows it to dissolve many different chemicals and nutrients." }
    ],
    '2': [
      { type: 'video', title: "2. Sewage Treatment", vid: "https://www.youtube-nocookie.com/embed/O1E5NIfw24w?autoplay=0" },
      { type: 'quiz', q: "What is the first step in wastewater treatment?", opts: ["Aeration", "Bar Screening", "Chlorination"], ans: 1, exp: "Bar screens physically remove large objects like rags, plastics, and cans before anything else." }
    ],
    '3': [
      { type: 'video', title: "3. Better Housekeeping", vid: "https://www.youtube-nocookie.com/embed/oNWAerr_xEE?autoplay=0" },
      { type: 'quiz', q: "Which daily habit saves water?", opts: ["Leaving the tap running while brushing", "Fixing leaky faucets immediately", "Watering plants at noon"], ans: 1, exp: "Even a small drip can waste dozens of gallons of water over a week." }
    ],
    '4': [
      { type: 'video', title: "4. Groundwater Depletion", vid: "https://www.youtube-nocookie.com/embed/VpXh1O6kK5c?autoplay=0" },
      { type: 'quiz', q: "What leads to groundwater becoming depleted?", opts: ["Extracting more water than rain can replenish", "Planting native trees", "Using rainwater harvesting"], ans: 0, exp: "Aquifers act like bank accounts. If we withdraw faster than natural recharge, the well runs dry." }
    ],
    '5': [
      { type: 'video', title: "5. River Pollution", vid: "https://www.youtube-nocookie.com/embed/7qszptSQEE4?autoplay=0" },
      { type: 'quiz', q: "What is an indicator of severe water pollution?", opts: ["Clear water", "Eutrophication (Algal blooms)", "Abundant fish"], ans: 1, exp: "Excess fertilizer runoff feeds algae, which bloom and strip the water of oxygen, harming marine life." }
    ],
    '6': [
      { type: 'video', title: "6. Desalination", vid: "https://www.youtube-nocookie.com/embed/mZ7bgkFgqJQ?autoplay=0" },
      { type: 'quiz', q: "Why isn't completely cleaning seawater used everywhere?", opts: ["It doesn't work", "It is extremely energy intensive and expensive", "People don't like the taste"], ans: 1, exp: "Removing salt via reverse osmosis requires massive amounts of power, making it costly." }
    ],
    '7': [
      { type: 'video', title: "7. Plastic in the Ocean", vid: "https://www.youtube-nocookie.com/embed/RS7IzU2VJIQ?autoplay=0" },
      { type: 'quiz', q: "How do microplastics harm marine ecosystems?", opts: ["They clean the water", "They provide food for fish", "Fish eat them, causing starvation and passing toxins up the food chain"], ans: 2, exp: "Microplastics act like toxic sponges that animals confuse for food." }
    ],
    '8': [
      { type: 'video', title: "Boss Challenge: Water Master", vid: "https://www.youtube-nocookie.com/embed/yKW4F0SKUPI?autoplay=0" },
      { type: 'quiz', q: "What is a sustainable method to manage urban water runoff?", opts: ["Concrete drainage systems", "Rain gardens and permeable pavements", "Dumping it in the ocean"], ans: 1, exp: "Permeable systems allow water to naturally seep into the ground, reducing flooding and filtering pollutants." }
    ]
  },
  soil: {
    '1': [
      { type: 'video', title: "1. What is Soil?", vid: "https://www.youtube-nocookie.com/embed/bgqea0B2ks?autoplay=0" },
      { type: 'quiz', q: "Which layer contains the most organic matter?", opts: ["Topsoil", "Subsoil", "Bedrock"], ans: 0, exp: "Topsoil is rich in humus and organic matter, making it the most fertile layer." }
    ],
    '2': [
      { type: 'video', title: "2. Soil Microbes & Worms", vid: "https://www.youtube-nocookie.com/embed/gTqfS4XFwN4?autoplay=0" },
      { type: 'quiz', q: "Why are earthworms famous as 'farmers' friends'?", opts: ["They eat insect pests", "They help loosen soil and add humus", "They protect crops from birds"], ans: 1, exp: "As they move, they aerate the soil and their castings provide rich nutrients." }
    ],
    '3': [
      { type: 'video', title: "3. Soil Erosion", vid: "https://www.youtube-nocookie.com/embed/im4HVXMGI68?autoplay=0" },
      { type: 'quiz', q: "What helps prevent soil erosion?", opts: ["Overgrazing", "Cutting down trees", "Planting trees with strong roots"], ans: 2, exp: "Plant roots clutch the soil tightly, preventing it from being washed away by rain or wind." }
    ],
    '4': [
      { type: 'video', title: "4. Composting Basics", vid: "https://www.youtube-nocookie.com/embed/dRXNoBvceig?autoplay=0" },
      { type: 'quiz', q: "What is composting?", opts: ["Burning trash", "Letting organic waste decompose into fertilizer", "Burying plastic"], ans: 1, exp: "Composting is the natural process of recycling organic matter into a valuable fertilizer." }
    ],
    '5': [
      { type: 'video', title: "5. Importance of Nitrogen", vid: "https://www.youtube-nocookie.com/embed/A8qTRBc8Bg?autoplay=0" },
      { type: 'quiz', q: "How do plants get nitrogen from the soil?", opts: ["They breathe it", "Nitrogen-fixing bacteria convert it for them", "They produce it"], ans: 1, exp: "Plants cannot use pure nitrogen gas; bacteria in the soil must 'fix' it into a usable form." }
    ],
    '6': [
      { type: 'video', title: "6. Soil Types Profile", vid: "https://www.youtube-nocookie.com/embed/7Vv93X84v7g?autoplay=0" },
      { type: 'quiz', q: "Which soil type retains the most water?", opts: ["Sand", "Clay", "Loam"], ans: 1, exp: "Clay particles are extremely fine and pack tightly, trapping water effectively." }
    ],
    '7': [
      { type: 'video', title: "7. Desertification", vid: "https://www.youtube-nocookie.com/embed/RkEx7ZhhwSg?autoplay=0" },
      { type: 'quiz', q: "What causes desertification?", opts: ["Over-irrigation, deforestation, and overgrazing", "Too much rain", "Planting too many crops"], ans: 0, exp: "Stripping the land of its natural cover exposes the topsoil, turning fertile land into desert." }
    ],
    '8': [
      { type: 'video', title: "Boss Challenge: Soil Master", vid: "https://www.youtube-nocookie.com/embed/R8y0k2r0M74?autoplay=0" },
      { type: 'quiz', q: "Why is crop rotation important for soil health?", opts: ["It confuses pests", "Different crops use and replenish different nutrients", "It makes farms look pretty"], ans: 1, exp: "Rotating crops prevents specific nutrient depletion and breaks pest life cycles naturally." }
    ]
  }
};

const htmlFile = 'c:/Users/Aniket Ingale/Downloads/EcoQuest/frontend/lesson-play.html';
let html = fs.readFileSync(htmlFile, 'utf8');

let dbStr = 'const DB = ' + JSON.stringify(realDB, null, 2) + ';';
let newHtml = html.replace(/const DB = \{[\s\S]*?\n\};/, dbStr);

fs.writeFileSync(htmlFile, newHtml);
console.log("Real DB populated!");
