// ═══════════════════════════════════════════════════════════════
//  Seed Script — Populates the database with sample data
//  Run with: npm run seed
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Task = require('./models/Task');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // ─── Clear existing data ─────────────────────────────────
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── Seed Users ──────────────────────────────────────────
    const users = await User.create([
      {
        firstName: 'Aarav',
        lastName: 'Sharma',
        schoolName: 'Pune Municipal High School',
        classStandard: 7,
        email: 'aarav@school.edu',
        rollNumber: 'ROLL2025001',
        password: 'password123',
        role: 'student',
        totalPoints: 320,
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        schoolName: 'Delhi Public School',
        classStandard: 8,
        email: 'priya@school.edu',
        rollNumber: 'ROLL2025002',
        password: 'password123',
        role: 'student',
        totalPoints: 450,
      },
      {
        firstName: 'Rohan',
        lastName: 'Gupta',
        schoolName: 'Kendriya Vidyalaya',
        classStandard: 6,
        email: 'rohan@school.edu',
        rollNumber: 'ROLL2025003',
        password: 'password123',
        role: 'student',
        totalPoints: 280,
      },
      {
        firstName: 'Ananya',
        lastName: 'Singh',
        schoolName: 'St. Mary School',
        classStandard: 9,
        email: 'ananya@school.edu',
        rollNumber: 'ROLL2025004',
        password: 'password123',
        role: 'student',
        totalPoints: 510,
      },
      {
        firstName: 'Vikram',
        lastName: 'Desai',
        schoolName: 'Mumbai International School',
        classStandard: 7,
        email: 'vikram@school.edu',
        rollNumber: 'ROLL2025005',
        password: 'password123',
        role: 'student',
        totalPoints: 390,
      },
      {
        firstName: 'Mrs. Sunita',
        lastName: 'Verma',
        schoolName: 'Pune Municipal High School',
        classStandard: 1,
        email: 'sunita.teacher@school.edu',
        rollNumber: 'TEACH001',
        password: 'teacher123',
        role: 'teacher',
        totalPoints: 0,
      },
    ]);
    console.log(`👤 Seeded ${users.length} users`);

    // ─── Seed Lessons ────────────────────────────────────────
    const lessons = await Lesson.create([
      {
        title: 'Forests: Our Lifeline',
        description: 'Understand the role of forests in maintaining ecological balance, biodiversity, and how deforestation affects the environment.',
        content: `<h2>What is a Forest?</h2>
<p>A forest is a large area of land covered with trees, shrubs, herbs, and a variety of animal species. Forests are often referred to as the "lungs of the Earth" because they absorb carbon dioxide and release oxygen.</p>

<h2>Products We Get From Forests</h2>
<ul>
<li><strong>Timber & Wood:</strong> Used for construction, furniture, and paper.</li>
<li><strong>Medicinal Plants:</strong> Many modern medicines originate from forest plants.</li>
<li><strong>Fruits, Nuts & Honey:</strong> Food sources for both humans and animals.</li>
<li><strong>Rubber, Gum & Resins:</strong> Industrial raw materials.</li>
</ul>

<h2>Why Are Forests Important?</h2>
<p>Forests prevent soil erosion, maintain the water cycle, provide habitat for wildlife, and help regulate climate. India's forest cover is about 21.71% of the total geographical area.</p>

<h2>Deforestation & Its Impact</h2>
<p>Cutting down forests leads to loss of biodiversity, soil erosion, flooding, and contributes to global warming. The NCERT curriculum highlights the need for afforestation and conservation.</p>`,
        classStandard: 7,
        icon: '🌳',
      },
      {
        title: 'Wastewater Story',
        description: 'Learn about how wastewater is generated, treated, and why proper sanitation matters for community health.',
        content: `<h2>What is Wastewater?</h2>
<p>Wastewater is any water that has been used and is no longer clean. It includes water from kitchens, bathrooms, laundry, and industrial processes.</p>

<h2>Types of Wastewater</h2>
<ul>
<li><strong>Sewage:</strong> Wastewater from toilets, containing human waste.</li>
<li><strong>Sullage:</strong> Wastewater from kitchens and bathrooms (no human waste).</li>
</ul>

<h2>Wastewater Treatment Process</h2>
<ol>
<li><strong>Bar Screening:</strong> Large objects like plastic bags and sticks are removed.</li>
<li><strong>Grit/Sand Removal:</strong> Water flows slowly so sand and grit settle down.</li>
<li><strong>Primary Treatment:</strong> Solids are allowed to settle (forming sludge).</li>
<li><strong>Aeration:</strong> Air is pumped in to help bacteria decompose organic waste.</li>
<li><strong>Final Treatment:</strong> Chlorination or UV treatment to kill remaining bacteria.</li>
</ol>

<h2>What Can You Do?</h2>
<p>Don't throw cooking oil down the drain. Don't flush chemicals or medicines. Use biodegradable soaps. Report leaking taps and pipes.</p>`,
        classStandard: 7,
        icon: '💧',
      },
      {
        title: 'Weather, Climate and Adaptations',
        description: 'Explore the difference between weather and climate, and how animals and plants adapt to different climatic conditions.',
        content: `<h2>Weather vs Climate</h2>
<p>Weather is the day-to-day condition of the atmosphere (temperature, humidity, rainfall). Climate is the average weather pattern of a place over a long period (25+ years).</p>

<h2>Climate Zones in India</h2>
<p>India has diverse climates — from the cold Himalayas to the hot Thar desert, from the wet Western Ghats to the dry Deccan plateau.</p>

<h2>Animal Adaptations</h2>
<ul>
<li><strong>Polar Bear:</strong> White fur for camouflage, thick fat layer for insulation.</li>
<li><strong>Penguin:</strong> Streamlined body, huddle together for warmth.</li>
<li><strong>Camel:</strong> Hump stores fat, long eyelashes protect from sand.</li>
<li><strong>Elephant:</strong> Large ears to radiate heat, mud baths for cooling.</li>
</ul>`,
        classStandard: 7,
        icon: '🌦️',
      },
      {
        title: 'Air Around Us',
        description: 'Discover the composition of air, its properties, and why clean air is essential for life on Earth.',
        content: `<h2>Composition of Air</h2>
<p>Air is a mixture of gases: 78% Nitrogen, 21% Oxygen, 0.03% Carbon Dioxide, and small amounts of other gases like argon, water vapour, and dust particles.</p>

<h2>Why Air Matters</h2>
<p>Oxygen is needed for breathing and combustion. Nitrogen is essential for plant growth. Carbon dioxide is used by plants in photosynthesis.</p>

<h2>Air Pollution</h2>
<p>Burning fossil fuels, industrial emissions, and vehicle exhaust pollute the air. This causes respiratory diseases, acid rain, and global warming.</p>`,
        classStandard: 6,
        icon: '🌬️',
      },
      {
        title: 'Garbage In, Garbage Out',
        description: 'Learn about waste management, composting, recycling, and how to reduce your ecological footprint.',
        content: `<h2>Types of Waste</h2>
<ul>
<li><strong>Biodegradable:</strong> Kitchen waste, paper, leaves — decompose naturally.</li>
<li><strong>Non-biodegradable:</strong> Plastic, glass, metal — do NOT decompose easily.</li>
</ul>

<h2>The 3 R's</h2>
<p><strong>Reduce</strong> – Use less. <strong>Reuse</strong> – Use again. <strong>Recycle</strong> – Convert waste into something new.</p>

<h2>Composting</h2>
<p>Composting is the process of converting biodegradable waste into nutrient-rich manure. You can compost at home using a simple pit or container.</p>

<h2>Vermicomposting</h2>
<p>Using earthworms (red worms) to speed up composting. The resulting vermicompost is excellent for gardening.</p>`,
        classStandard: 6,
        icon: '♻️',
      },
    ]);
    console.log(`📚 Seeded ${lessons.length} lessons`);

    // ─── Seed Quizzes ────────────────────────────────────────
    const quizzes = await Quiz.create([
      {
        lessonId: lessons[0]._id, // Forests: Our Lifeline
        title: 'Forests: Our Lifeline Quiz',
        pointsPerQuestion: 10,
        questions: [
          {
            questionText: 'What percentage of India\'s area is covered by forests?',
            options: ['15%', '21.71%', '33%', '45%'],
            correctAnswer: '21.71%',
          },
          {
            questionText: 'Which of the following is NOT a product of forests?',
            options: ['Timber', 'Honey', 'Petroleum', 'Rubber'],
            correctAnswer: 'Petroleum',
          },
          {
            questionText: 'What is deforestation?',
            options: [
              'Planting new trees',
              'Clearing of forests',
              'Protecting wildlife',
              'Watering plants',
            ],
            correctAnswer: 'Clearing of forests',
          },
          {
            questionText: 'Forests help prevent which of the following?',
            options: ['Soil erosion', 'Earthquakes', 'Volcanic eruptions', 'Tsunamis'],
            correctAnswer: 'Soil erosion',
          },
          {
            questionText: 'Forests are called the "lungs of the Earth" because they:',
            options: [
              'Produce medicine',
              'Absorb CO₂ and release O₂',
              'Provide shade',
              'Store water underground',
            ],
            correctAnswer: 'Absorb CO₂ and release O₂',
          },
        ],
      },
      {
        lessonId: lessons[1]._id, // Wastewater Story
        title: 'Wastewater Story Quiz',
        pointsPerQuestion: 10,
        questions: [
          {
            questionText: 'What is sewage?',
            options: [
              'Clean drinking water',
              'Wastewater from toilets',
              'Rainwater',
              'River water',
            ],
            correctAnswer: 'Wastewater from toilets',
          },
          {
            questionText: 'Which step in water treatment uses bacteria to decompose waste?',
            options: ['Bar screening', 'Grit removal', 'Aeration', 'Chlorination'],
            correctAnswer: 'Aeration',
          },
          {
            questionText: 'What should you NOT throw down the drain?',
            options: ['Water', 'Cooking oil', 'Nothing', 'Soap water'],
            correctAnswer: 'Cooking oil',
          },
          {
            questionText: 'The final step of water treatment often involves:',
            options: ['Adding sugar', 'Chlorination', 'Boiling', 'Freezing'],
            correctAnswer: 'Chlorination',
          },
        ],
      },
      {
        lessonId: lessons[4]._id, // Garbage In, Garbage Out
        title: 'Garbage In, Garbage Out Quiz',
        pointsPerQuestion: 10,
        questions: [
          {
            questionText: 'Which of these is biodegradable?',
            options: ['Plastic bag', 'Glass bottle', 'Banana peel', 'Aluminium can'],
            correctAnswer: 'Banana peel',
          },
          {
            questionText: 'What does the "3 R\'s" stand for?',
            options: [
              'Read, Redo, Repeat',
              'Reduce, Reuse, Recycle',
              'Run, Rest, Relax',
              'Remove, Replace, Repair',
            ],
            correctAnswer: 'Reduce, Reuse, Recycle',
          },
          {
            questionText: 'What is vermicomposting?',
            options: [
              'Burning waste',
              'Using worms to make compost',
              'Dumping waste in rivers',
              'Burying plastic underground',
            ],
            correctAnswer: 'Using worms to make compost',
          },
        ],
      },
    ]);
    console.log(`📝 Seeded ${quizzes.length} quizzes`);

    // ─── Seed Tasks ──────────────────────────────────────────
    const tasks = await Task.create([
      {
        title: 'Plant a Tree Sapling',
        description: 'Plant a tree sapling in your school, home, or neighbourhood. Take a photo with the planted sapling as proof.',
        pointsReward: 100,
        difficulty: 'easy',
        icon: '🌱',
      },
      {
        title: 'Make a Bio-Enzyme Cleaner',
        description: 'Using citrus peels (orange/lemon), jaggery, and water, prepare a bio-enzyme cleaner. Document the process with photos.',
        pointsReward: 150,
        difficulty: 'medium',
        icon: '🍊',
      },
      {
        title: 'Conduct a Waste Audit',
        description: 'Collect and categorize all the waste your family generates in one day. Separate into biodegradable and non-biodegradable. Take a photo of your sorted waste.',
        pointsReward: 80,
        difficulty: 'easy',
        icon: '🗑️',
      },
      {
        title: 'Create a Rain Gauge',
        description: 'Build a simple rain gauge using a plastic bottle and ruler. Measure rainfall for 3 days and record your data. Submit a photo of your rain gauge.',
        pointsReward: 120,
        difficulty: 'medium',
        icon: '🌧️',
      },
      {
        title: 'Build a Compost Pit',
        description: 'Set up a small composting system at home using kitchen waste. Document the setup with photos and track decomposition for 1 week.',
        pointsReward: 200,
        difficulty: 'hard',
        icon: '♻️',
      },
      {
        title: 'Water Conservation Poster',
        description: 'Design a creative poster about water conservation. Use recycled materials if possible. Photograph your finished poster.',
        pointsReward: 70,
        difficulty: 'easy',
        icon: '🎨',
      },
      {
        title: 'Neighbourhood Clean-Up Drive',
        description: 'Organize or participate in a clean-up drive in your neighbourhood or school grounds. Collect at least 2 kg of waste. Take before and after photos.',
        pointsReward: 180,
        difficulty: 'hard',
        icon: '🧹',
      },
      {
        title: 'Make a Room Freshener from Orange Peels',
        description: 'Create a natural room freshener using dried orange peels, cloves, and cinnamon. Document the step-by-step process with photos.',
        pointsReward: 90,
        difficulty: 'easy',
        icon: '🍊',
      },
    ]);
    console.log(`🌿 Seeded ${tasks.length} tasks`);

    // ─── Done ────────────────────────────────────────────────
    console.log('\n🎉 Database seeded successfully!');
    console.log('──────────────────────────────────────');
    console.log('📧 Test Student Login:  aarav@school.edu / password123');
    console.log('📧 Test Teacher Login:  sunita.teacher@school.edu / teacher123');
    console.log('──────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
