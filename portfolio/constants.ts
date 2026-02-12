
import { PortfolioData, Skill } from './types';

export const DEFAULT_PORTFOLIO: PortfolioData = {
  profile: {
    name: "Siphamandla Mahlangu",
    role: "Software Engineer  | AI Enthusiast",
    bio: "Honours-level IT Engineer specializing in robust backend architectures and high-stakes strategic logic. Focused on delivering high-performance, secure solutions for the South African Fintech sector.",
    location: "Cape Town, South Africa",
    email: "Msqmahlangu@gmail.com",
    github: "github.com/MAHLANGU-MS/Personal-Projects",
    linkedin: "linkedin.com/in/siphamandla-mahlangu",
    resumeUrl: "#"
  },
  projects: [
    {
      id: "1",
      title: "Renovation Booking App",
      description: "Engineered a scalable RESTful API backend using Node.js and MySQL, adhering to strict OOP principles and modern design patterns.",
      technologies: ["Node.js", "MySQL", "Git", "OOP", "REST API"],
      github: "https://github.com/MAHLANGU-MS/Personal-Projects",
      image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "2",
      title: "Streaker App",
      description: "Application that allows users to track their daily habits and create streaks.",
      technologies: ["ReactNative", "Node.js", "MySQL", "Git"],
      image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "3",
      title: "Focus Flow",
      description: "Application that facilitates focus during reading for users with ADHD",
      technologies: ["Java", "React", "Python", "Node.js", "Git"],
      image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=800"
    }
    ,
    {
      id: "4",
      title: "Genre Guesser",
      description: "Application that allows users to guess the genre of a song.",
      technologies: ["Python", "Flask", "MySQL", "React", "Git"],
      image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=800"
    }
  ],
  skills: [
    // FRONTEND
    { name: "React.js", category: "frontend", level: 90 },
    { name: "JavaScript (ES6+)", category: "frontend", level: 85 },
    { name: "TypeScript", category: "frontend", level: 80 },
    { name: "Tailwind CSS", category: "frontend", level: 80 },
    { name: "HTML5/CSS3", category: "frontend", level: 100 },
    
    // BACKEND
    { name: "C#", category: "backend", level: 60 },
    { name: ".NET Core", category: "backend", level: 60 },
    { name: "Java", category: "backend", level: 80 },
    { name: "Spring Boot", category: "backend", level: 50 },
    { name: "Node.js", category: "backend", level: 97 },
    { name: "Python", category: "backend", level: 80 },
    { name: "RESTful APIs", category: "backend", level: 100 },
    // AI & TOOLS
    { name: "Python Machine Learning", category: "ai_tools", level: 82 },
    { name: "Prompt Engineering", category: "ai_tools", level: 85 },
    { name: "Git/GitHub", category: "ai_tools", level: 90 },
    { name: "Docker", category: "ai_tools", level: 75 },
    { name: "CI/CD (Azure DevOps)", category: "ai_tools", level: 30 },
    
    // DATA
    { name: "SQL (T-SQL, PL/pgSQL)", category: "data", level: 100 },
    { name: "MSSQL", category: "data", level: 100 },
    { name: "MySQL", category: "data", level: 100 },
    { name: "PostgreSQL", category: "data", level: 85 },
    { name: "MongoDB", category: "data", level: 70 },
    { name: "Data Cleaning Techniques", category: "data", level: 95 },
    { name: "Power BI", category: "data", level: 85 },
    
    // GENERAL
    { name: "Object-Oriented Programming (OOP)", category: "general", level: 100 },
    { name: "Test-Driven Development (TDD)", category: "general", level: 80 },
    { name: "Unit Testing Principles", category: "general", level: 85 },
    
    // TESTING TOOLS
    { name: "JUnit", category: "testing", level: 85 },
    { name: "Jest", category: "testing", level: 80 },
    
    // CURRENTLY LEARNING
    { name: "Rust", category: "learning", level: 30 },
    { name: "Kubernetes", category: "learning", level: 25 },
    { name: "GraphQL", category: "learning", level: 40 }
  ],
  experience: [
    {
      company: "Astron Energy",
      position: "IT Intern",
      period: "Jan 2025 - Present",
      description: [
        "UX Design & Implementation: Translated high-level workflows into elegant, user-friendly interfaces, resulting in increased employee satisfaction and data accuracy across multiple departments.",
        "Managed complex relational databases using MSSQL ensuring high integrity.",
        "Led full SDLC for internal tools within strict Agile deadlines.",
        "Data Visualization Dashboards: Architected Power BI Dashboards to transform data sets into actionable insights, giving stakeholders a real-time view into their operations and enabling data-driven decisions.",
        "Optimized business operations reducing resource overhead via digital workflows."
      ]
    },
    {
      company: "Vusizwe Projects",
      position: "Full Stack Developer",
      period: "Project Basis",
      description: [
        "Developed secure user authentication workflows and real-time data updates.",
        "Collaborated in a 3-person Agile team managing Git branching and code reviews.",
        "Implemented comprehensive unit testing to validate business logic."
      ]
    }
  ]
};

export const TERMINAL_GREETING = [
  "SESSION_START: " + new Date().toLocaleTimeString(),
  "STATUS: READY",
  "---------------------------------------------------",
  "Welcome to the shell.",
  "---------------------------------------------------"
];
