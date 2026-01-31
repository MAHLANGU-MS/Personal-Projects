
export interface Profile {
  name: string;
  role: string;
  bio: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'ai_tools' | 'data' | 'general' | 'testing' | 'learning';
  level: number; // 1-100
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string[];
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'ai';
  id: string;
}
