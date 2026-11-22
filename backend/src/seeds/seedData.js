const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');

dotenv.config();

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const ExchangeRequest = require('../models/ExchangeRequest');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
const LearningProgress = require('../models/LearningProgress');
const Report = require('../models/Report');

const skillsCatalog = [
  { name: 'Python', category: 'Programming & Tech', popularity: 98, description: 'General-purpose programming, scripting, and backend development' },
  { name: 'Machine Learning', category: 'Data Science & AI', popularity: 95, description: 'scikit-learn, supervised & unsupervised learning, model evaluation' },
  { name: 'UI/UX Design', category: 'Design & Creative', popularity: 92, description: 'Wireframing, user journey maps, design systems, usability testing' },
  { name: 'Figma', category: 'Design & Creative', popularity: 94, description: 'Component libraries, auto-layout, interactive prototyping' },
  { name: 'React.js', category: 'Programming & Tech', popularity: 96, description: 'Component lifecycle, hooks, state management, modern frontend' },
  { name: 'Node.js', category: 'Programming & Tech', popularity: 90, description: 'Event-driven asynchronous server-side JavaScript and REST APIs' },
  { name: 'Data Structures & Algorithms', category: 'Academics & Science', popularity: 97, description: 'Arrays, Trees, Graphs, Dynamic Programming, Big-O' },
  { name: 'C++', category: 'Programming & Tech', popularity: 88, description: 'Object-oriented programming, STL, memory management, competitive coding' },
  { name: 'Cloud Computing (AWS)', category: 'Programming & Tech', popularity: 89, description: 'EC2, S3, Lambda serverless, IAM security and deployment' },
  { name: 'DevOps & Docker', category: 'Programming & Tech', popularity: 91, description: 'Containerization, CI/CD pipelines, container orchestration' },
  { name: 'Cybersecurity & Ethical Hacking', category: 'Programming & Tech', popularity: 86, description: 'Network security, penetration testing, OWASP Top 10 vulnerabilities' },
  { name: 'Mobile App Development (Flutter)', category: 'Programming & Tech', popularity: 85, description: 'Cross-platform native iOS & Android applications with Dart' },
  { name: 'Digital Marketing & SEO', category: 'Business & Marketing', popularity: 80, description: 'Search optimization, conversion funnels, analytics, content strategy' },
  { name: 'Graphic Design & Photoshop', category: 'Design & Creative', popularity: 84, description: 'Visual branding, raster editing, typography, vector assets' },
  { name: 'Spanish Language', category: 'Languages', popularity: 78, description: 'Conversational fluency, grammar, and pronunciation' },
  { name: 'French Language', category: 'Languages', popularity: 76, description: 'Everyday dialogue, phonetics, and academic writing' },
  { name: 'Music Production (Ableton Live)', category: 'Music & Arts', popularity: 75, description: 'Audio mixing, synthesis, beat making, mastering fundamentals' },
  { name: 'Public Speaking & Presentation', category: 'Academics & Science', popularity: 82, description: 'Pitching, vocal projection, body language, slide storytelling' }
];

const studentsData = [
  {
    name: 'Aisha Jawed',
    email: 'aisha@skillsync.edu',
    password: 'Password@123',
    role: 'student',
    profile: {
      college: 'Delhi Technological University',
      department: 'Computer Science & Engineering',
      academicYear: '3rd Year',
      headline: 'AI/ML Enthusiast & Python Developer seeking UI/UX Design Mentor',
      bio: 'Third-year CSE student exploring AI recommendation models and scalable backends. Love mentoring peers in Python and Machine Learning while eager to master modern design tools like Figma.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      teachSkills: [
        { skillName: 'Python', category: 'Programming & Tech', proficiencyLevel: 5, yearsOfExperience: 3, description: 'Advanced Python, OOP, APIs, and data structures' },
        { skillName: 'Machine Learning', category: 'Data Science & AI', proficiencyLevel: 4, yearsOfExperience: 2, description: 'scikit-learn, regression, classification, TF-IDF vectorization' }
      ],
      learnSkills: [
        { skillName: 'UI/UX Design', category: 'Design & Creative', targetProficiency: 4, priority: 'high', notes: 'Need to design sleek web application mockups and design systems' },
        { skillName: 'React.js', category: 'Programming & Tech', targetProficiency: 4, priority: 'medium', notes: 'Building modern responsive web apps' }
      ],
      interests: ['Artificial Intelligence', 'Product Design', 'Open Source', 'Hackathons'],
      availability: ['Weekdays Evenings', 'Weekends'],
      preferredMode: 'online',
      location: 'New Delhi, India',
      socialLinks: { github: 'https://github.com/aisha-j', linkedin: 'https://linkedin.com/in/aisha-j' },
      averageRating: 4.9,
      totalReviews: 8,
      completedExchanges: 4
    }
  },
  {
    name: 'Sonali Kumari',
    email: 'sonali@skillsync.edu',
    password: 'Password@123',
    role: 'student',
    profile: {
      college: 'IIT Bombay',
      department: 'Design & Computer Science',
      academicYear: '3rd Year',
      headline: 'Design Lead & Frontend Builder wanting to learn Python AI & ML',
      bio: 'Passionate about crafting minimalist, intuitive user experiences inspired by Linear and Notion. Offering expert mentorship in UI/UX and React, seeking a peer to teach me Python data science.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      teachSkills: [
        { skillName: 'UI/UX Design', category: 'Design & Creative', proficiencyLevel: 5, yearsOfExperience: 3, description: 'Design tokens, auto-layout, wireframes, user testing' },
        { skillName: 'Figma', category: 'Design & Creative', proficiencyLevel: 5, yearsOfExperience: 3, description: 'Advanced component systems and interactive prototypes' },
        { skillName: 'React.js', category: 'Programming & Tech', proficiencyLevel: 4, yearsOfExperience: 2, description: 'Tailwind CSS, component architecture, hooks' }
      ],
      learnSkills: [
        { skillName: 'Python', category: 'Programming & Tech', targetProficiency: 5, priority: 'high', notes: 'Learn Python fundamentals for AI/ML projects' },
        { skillName: 'Machine Learning', category: 'Data Science & AI', targetProficiency: 4, priority: 'high', notes: 'Understand ML algorithms and model evaluation' }
      ],
      interests: ['Product Design', 'Artificial Intelligence', 'Typography', 'Web Development'],
      availability: ['Weekdays Evenings', 'Weekends'],
      preferredMode: 'online',
      location: 'Mumbai, India',
      socialLinks: { github: 'https://github.com/sonali-k', linkedin: 'https://linkedin.com/in/sonali-k' },
      averageRating: 5.0,
      totalReviews: 12,
      completedExchanges: 6
    }
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@skillsync.edu',
    password: 'Password@123',
    role: 'student',
    profile: {
      college: 'BITS Pilani',
      department: 'Information Technology',
      academicYear: '4th Year',
      headline: 'Competitive Programmer & DSA Mentor seeking Cloud DevOps guidance',
      bio: 'Solved 800+ LeetCode problems. Love breaking down complex tree and graph problems. Looking for someone with hands-on AWS or Docker experience for production deployments.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      teachSkills: [
        { skillName: 'Data Structures & Algorithms', category: 'Academics & Science', proficiencyLevel: 5, yearsOfExperience: 3, description: 'Graphs, Dynamic Programming, algorithmic patterns' },
        { skillName: 'C++', category: 'Programming & Tech', proficiencyLevel: 4, yearsOfExperience: 3, description: 'Modern C++, STL, competitive programming tricks' }
      ],
      learnSkills: [
        { skillName: 'Cloud Computing (AWS)', category: 'Programming & Tech', targetProficiency: 4, priority: 'high', notes: 'Master AWS Lambda, S3, and microservice infrastructure' },
        { skillName: 'DevOps & Docker', category: 'Programming & Tech', targetProficiency: 4, priority: 'medium', notes: 'Learn containerization and deployment pipelines' }
      ],
      interests: ['Algorithms', 'System Architecture', 'Cloud Tech', 'Chess'],
      availability: ['Weekends'],
      preferredMode: 'online',
      location: 'Pilani, India',
      socialLinks: { github: 'https://github.com/rahul-s' },
      averageRating: 4.8,
      totalReviews: 7,
      completedExchanges: 3
    }
  },
  {
    name: 'Priya Patel',
    email: 'priya@skillsync.edu',
    password: 'Password@123',
    role: 'student',
    profile: {
      college: 'NIT Trichy',
      department: 'Computer Science',
      academicYear: '3rd Year',
      headline: 'Cloud Engineer & DevOps Builder eager to level up on DSA and C++',
      bio: 'Experienced in deploying scalable microservices to AWS with Docker and GitHub Actions. Keen to improve my algorithmic problem solving for upcoming interview seasons.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      teachSkills: [
        { skillName: 'Cloud Computing (AWS)', category: 'Programming & Tech', proficiencyLevel: 5, yearsOfExperience: 2, description: 'AWS infrastructure, serverless, VPC, security' },
        { skillName: 'DevOps & Docker', category: 'Programming & Tech', proficiencyLevel: 4, yearsOfExperience: 2, description: 'Multi-stage Docker builds, docker-compose, CI/CD' }
      ],
      learnSkills: [
        { skillName: 'Data Structures & Algorithms', category: 'Academics & Science', targetProficiency: 5, priority: 'high', notes: 'Master complex graph algorithms and DP' },
        { skillName: 'C++', category: 'Programming & Tech', targetProficiency: 4, priority: 'medium', notes: 'Competitive programming' }
      ],
      interests: ['Cloud Tech', 'Algorithms', 'Distributed Systems', 'Robotics'],
      availability: ['Weekends', 'Weekdays Evenings'],
      preferredMode: 'online',
      location: 'Trichy, India',
      socialLinks: { github: 'https://github.com/priya-p' },
      averageRating: 4.9,
      totalReviews: 9,
      completedExchanges: 5
    }
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@skillsync.edu',
    password: 'Password@123',
    role: 'student',
    profile: {
      college: 'UC Berkeley',
      department: 'EECS',
      academicYear: '4th Year',
      headline: 'Full-Stack Developer & Node.js Engineer curious about Flutter Mobile',
      bio: 'Built dozens of REST and GraphQL backends in Node.js and Express. Want to branch into cross-platform mobile apps with Flutter.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      teachSkills: [
        { skillName: 'Node.js', category: 'Programming & Tech', proficiencyLevel: 5, yearsOfExperience: 3, description: 'Express, real-time WebSockets, microservices' },
        { skillName: 'React.js', category: 'Programming & Tech', proficiencyLevel: 4, yearsOfExperience: 2, description: 'Full stack Next.js and React SPAs' }
      ],
      learnSkills: [
        { skillName: 'Mobile App Development (Flutter)', category: 'Programming & Tech', targetProficiency: 4, priority: 'high', notes: 'Build mobile apps from one codebase' }
      ],
      interests: ['Web Development', 'Mobile Apps', 'Open Source', 'Startups'],
      availability: ['Weekdays Evenings'],
      preferredMode: 'hybrid',
      location: 'Berkeley, CA',
      socialLinks: { github: 'https://github.com/marcus-c' },
      averageRating: 4.7,
      totalReviews: 5,
      completedExchanges: 2
    }
  },
  {
    name: 'Elena Rostova',
    email: 'elena@skillsync.edu',
    password: 'Password@123',
    role: 'student',
    profile: {
      college: 'Sorbonne University',
      department: 'Linguistics & International Studies',
      academicYear: '2nd Year',
      headline: 'Polyglot & French Mentor seeking Spanish & Digital Marketing exchange',
      bio: 'Native French speaker passionate about teaching language acquisition techniques and conversational fluency. Want to master digital marketing and Spanish.',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      teachSkills: [
        { skillName: 'French Language', category: 'Languages', proficiencyLevel: 5, yearsOfExperience: 5, description: 'Native fluency, pronunciation, grammar, conversational practice' }
      ],
      learnSkills: [
        { skillName: 'Spanish Language', category: 'Languages', targetProficiency: 4, priority: 'high', notes: 'Achieve conversational fluency' },
        { skillName: 'Digital Marketing & SEO', category: 'Business & Marketing', targetProficiency: 3, priority: 'medium', notes: 'Social media growth and campaigns' }
      ],
      interests: ['Linguistics', 'Travel', 'Literature', 'Marketing'],
      availability: ['Weekdays Evenings', 'Weekends'],
      preferredMode: 'online',
      location: 'Paris, France',
      socialLinks: {},
      averageRating: 5.0,
      totalReviews: 6,
      completedExchanges: 3
    }
  }
];

const seedDatabase = async (shouldDisconnect = false) => {
  try {
    if (shouldDisconnect) {
      console.log('[Seed] Connecting to database...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Skill.deleteMany({});
    await ExchangeRequest.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Review.deleteMany({});
    await LearningProgress.deleteMany({});
    await Report.deleteMany({});

    console.log('[Seed] Seeding Skills directory...');
    await Skill.insertMany(skillsCatalog);

    console.log('[Seed] Seeding Admin user...');
    const adminUser = await User.create({
      name: 'Platform Administrator',
      email: 'admin@skillsync.edu',
      password: 'AdminPassword@123',
      role: 'admin',
      isVerified: true
    });

    console.log('[Seed] Seeding Students & Profiles...');
    const createdUsers = [];
    for (const student of studentsData) {
      const u = await User.create({
        name: student.name,
        email: student.email,
        password: student.password,
        role: student.role,
        isVerified: true
      });

      const p = await StudentProfile.create({
        user: u._id,
        ...student.profile
      });

      createdUsers.push({ user: u, profile: p });
    }

    const aisha = createdUsers[0].user;
    const sonali = createdUsers[1].user;
    const rahul = createdUsers[2].user;
    const priya = createdUsers[3].user;

    console.log('[Seed] Seeding Active Exchange Request & Conversation...');
    // Create an accepted exchange between Aisha and Sonali (Python ⇄ UI/UX)
    const exchange1 = await ExchangeRequest.create({
      sender: aisha._id,
      receiver: sonali._id,
      offeredSkill: 'Python',
      requestedSkill: 'UI/UX Design',
      initialMessage: 'Hey Sonali! I saw you are teaching UI/UX and want to learn Python. I would love to do a mutual exchange!',
      proposedSchedule: 'Saturday & Sunday 4 PM - 6 PM',
      learningMode: 'online',
      status: 'accepted',
      acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    // Create Conversation
    const conversation = await Conversation.create({
      participants: [aisha._id, sonali._id],
      exchangeRequest: exchange1._id,
      lastActivity: new Date()
    });

    // Seed Messages
    const msg1 = await Message.create({
      conversation: conversation._id,
      sender: aisha._id,
      content: 'Hi Sonali! Super excited for our exchange session this weekend.',
      readBy: [aisha._id, sonali._id],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    const msg2 = await Message.create({
      conversation: conversation._id,
      sender: sonali._id,
      content: 'Hey Aisha! Likewise! I prepared a starter Figma file for us to review design tokens and layout grids.',
      readBy: [aisha._id, sonali._id],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    conversation.lastMessage = msg2._id;
    await conversation.save();

    console.log('[Seed] Seeding Learning Progress Roadmaps...');
    const progressAisha = await LearningProgress.create({
      exchangeRequest: exchange1._id,
      student: aisha._id,
      mentor: sonali._id,
      skill: 'UI/UX Design',
      title: 'UI/UX Design Mastery for Aisha',
      milestones: [
        { title: 'Figma Fundamentals & Canvas Setup', description: 'Master frames, grids, vector pen tool', completed: true, completedAt: new Date() },
        { title: 'Typography, Color Palettes & Contrast', description: 'WCAG compliance and font hierarchies', completed: true, completedAt: new Date() },
        { title: 'Auto-Layout & Reusable Components', description: 'Building scalable buttons, inputs, and cards', completed: false },
        { title: 'Interactive Prototype & Usability Review', description: 'Wireframe click-through flow', completed: false }
      ],
      notes: [
        { author: sonali._id, content: 'Aisha demonstrated great grasp of typographic scale during session 1!' }
      ]
    });
    progressAisha.recalculateProgress();
    await progressAisha.save();

    console.log('[Seed] Seeding Sample Reviews & Notifications...');
    // Seed a completed exchange between Rahul and Priya
    const exchange2 = await ExchangeRequest.create({
      sender: rahul._id,
      receiver: priya._id,
      offeredSkill: 'Data Structures & Algorithms',
      requestedSkill: 'Cloud Computing (AWS)',
      initialMessage: 'Hi Priya, would love to exchange DSA practice for AWS architecture tutoring.',
      status: 'completed',
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    await Review.create({
      exchangeRequest: exchange2._id,
      reviewer: rahul._id,
      reviewee: priya._id,
      rating: 5,
      comment: 'Priya is an incredible mentor! She explained AWS VPCs and Docker multi-stage builds clearly and patiently.',
      skillTaught: 'Cloud Computing (AWS)'
    });

    await Review.create({
      exchangeRequest: exchange2._id,
      reviewer: priya._id,
      reviewee: rahul._id,
      rating: 5,
      comment: 'Rahul explained Graph traversal and Dynamic Programming algorithms with such intuitive visuals. Highly recommend him!',
      skillTaught: 'Data Structures & Algorithms'
    });

    // Seed Notifications
    await Notification.create({
      recipient: aisha._id,
      sender: sonali._id,
      type: 'request_accepted',
      title: 'Exchange Request Accepted!',
      message: 'Sonali accepted your skill exchange request for Python ⇄ UI/UX Design.',
      link: '/dashboard/chat',
      isRead: true
    });

    await Notification.create({
      recipient: aisha._id,
      sender: sonali._id,
      type: 'new_message',
      title: 'New message from Sonali',
      message: 'Hey Aisha! Likewise! I prepared a starter Figma file for us...',
      link: '/dashboard/chat',
      isRead: false
    });

    console.log('✅ [Seed] Database seeding completed successfully!');
    console.log('==================================================');
    console.log('Demo Credentials:');
    console.log('👤 Student (Aisha): aisha@skillsync.edu | Password@123');
    console.log('👤 Student (Sonali): sonali@skillsync.edu | Password@123');
    console.log('👤 Student (Rahul): rahul@skillsync.edu | Password@123');
    console.log('🛡️ Admin: admin@skillsync.edu | AdminPassword@123');
    console.log('==================================================');

    if (shouldDisconnect) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ [Seed Error]:', error);
    if (shouldDisconnect) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase };
