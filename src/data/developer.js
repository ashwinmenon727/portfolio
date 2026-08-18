const base = import.meta.env.BASE_URL || '/';
const cleanBase = base.endsWith('/') ? base : `${base}/`;
const resumePath = `${cleanBase}Ashwin_Menon_ATS_Optimized_Resume.pdf`;

export const developer = {
  name: 'Ashwin Menon',
  role: 'AI Vibe Coder & Software Developer',
  email: 'ashwinmenon2112@gmail.com',
  github: 'https://github.com/ashwinmenon727',
  githubUsername: 'ashwinmenon727',
  linkedin: 'https://www.linkedin.com/in/ashwin-menon-3a175b377',
  leetcode: 'https://leetcode.com/u/ashwinmenon2006/',
  resume: resumePath,
  emailLabel: 'ashwinmenon2112@gmail.com',
  // CONTACT LINKS — edit these values to update the Contact section. The
  // resume file lives at /public/Ashwin_Menon_ATS_Optimized_Resume.pdf.
  contact: {
    email: 'ashwinmenon2112@gmail.com',
    github: 'https://github.com/ashwinmenon727',
    linkedin: 'https://www.linkedin.com/in/ashwin-menon-3a175b377',
    leetcode: 'https://leetcode.com/u/ashwinmenon2006/',
    resume: resumePath,
    availability: 'AVAILABLE FOR INTERNSHIPS',
  },
  summary:
    'I build modern, AI-powered web experiences and full-stack applications with a focus on clean UI, real-world functionality, and rapid development. Currently looking for software development internships where I can build, learn, and contribute to impactful products.',
  about:
    "I'm a Computer Science Engineering student and AI-assisted developer who enjoys turning ideas into working products. I use modern development tools and AI coding workflows to prototype, build, debug, and ship applications quickly — from full-stack platforms and AI assistants to interactive React experiences.",
  aboutStatement: "I BUILD THINGS. I LEARN FAST. I SHIP PRODUCTS.",
  stats: [
    { label: 'Projects', value: 4, suffix: '+' },
    { label: 'Technologies', value: 15, suffix: '+' },
    { label: 'Internships', value: 2, suffix: '' },
    { label: 'Seeking', value: 'Opportunities', suffix: '' },
  ],
  capabilities: [
    'Full-Stack Development',
    'AI-Powered Applications',
    'Frontend Engineering',
    'Rapid Prototyping',
    'Backend APIs',
  ],
  techStack: [
    { category: 'Languages', items: ['JavaScript', 'Python', 'Java', 'C', 'C#'] },
    { category: 'Frontend', items: ['React.js', 'React 19', 'HTML5', 'CSS3', 'Chart.js'] },
    { category: 'Backend', items: ['ASP.NET Core 10', 'Node.js', 'Express', 'REST APIs'] },
    { category: 'Databases', items: ['PostgreSQL', 'SQLite', 'MongoDB', 'Entity Framework Core'] },
    { category: 'AI / Development', items: ['AI-Assisted Development', 'AI Application Development', 'NLP', 'API Integration'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Postman / Thunder Client'] },
    { category: 'Core Concepts', items: ['Data Structures', 'OOP', 'Authentication', 'RBAC', 'Testing', 'Debugging'] },
  ],
  services: [
    {
      title: 'FULL-STACK APPLICATIONS',
      description: 'Modern web applications with React, backend APIs, authentication and databases.',
    },
    {
      title: 'AI-POWERED APPLICATIONS',
      description: 'AI assistants and intelligent applications using modern AI APIs and development workflows.',
    },
    {
      title: 'FRONTEND EXPERIENCES',
      description: 'Responsive, interactive interfaces with modern UI/UX, animations and React.',
    },
    {
      title: 'BACKEND & APIS',
      description: 'REST APIs, authentication, authorization, database integration and server-side functionality.',
    },
    {
      title: 'RAPID PROTOTYPING',
      description: 'Turning ideas into functional products quickly using AI-assisted development and modern coding tools.',
    },
  ],
};

export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export const experience = [
  {
    year: 'May 2026 – July 2026',
    role: 'Software Developer Intern',
    company: 'Saint-Gobain — Kanjikode, Kerala',
    description:
      'Developed and delivered a 5S Audit Management System using ASP.NET Core 10, C#, PostgreSQL, Entity Framework Core, React 19 and Chart.js. Replaced manual spreadsheet-based workflows and automated a 29-page Power BI reporting process.',
    technologies: ['ASP.NET Core 10', 'C#', 'React 19', 'PostgreSQL', 'Entity Framework Core'],
  },
  {
    year: '2024',
    role: 'Python Full Stack Developer Intern',
    company: 'Spectrum — Kochi, Kerala',
    description:
      'Worked on Python-based full-stack applications and gained practical experience with backend development, REST APIs, database integration and professional development workflows.',
    technologies: ['Python', 'REST APIs', 'Databases', 'Backend Development'],
  },
];
