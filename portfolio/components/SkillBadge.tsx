import React from 'react';
import { Skill } from '../types';
import { 
  FaReact, FaNodeJs, FaDocker, FaGitAlt, 
  FaPython, FaJava, FaDatabase, FaJs,
  FaMicrosoft, FaCloud, FaServer
} from 'react-icons/fa';
import { 
  SiSharp, SiTypescript, SiTailwindcss, SiSpring, 
  SiPytorch, SiPandas, SiJest, SiMongodb,
   SiPostgresql, SiMysql, 
  Si365Datascience
} from 'react-icons/si';

interface SkillBadgeProps {
  skill: Skill;
}

interface SkillInfo {
  icon: React.ReactNode;
  color: string;
}

const getSkillInfo = (name: string): SkillInfo => {
  const n = name.toLowerCase();
  const iconSize = 24; // Base icon size
  
  // Programming Languages
  if (n.includes('c#') || n.includes('.net')) return { 
    icon: <SiSharp size={iconSize} />,
    color: '#9b4f96' // Purple
  };
  if (n.includes('javascript') || n === 'js') return {
    icon: <FaJs size={iconSize} />,
    color: '#f0db4f' // Yellow
  };
  if (n.includes('typescript') || n === 'ts') return {
    icon: <SiTypescript size={iconSize} />,
    color: '#3178c6' // Blue
  };
  if (n.includes('python') && !n.includes('machine')) return {
    icon: <FaPython size={iconSize} />,
    color: '#3776ab' // Blue
  };
  if (n.includes('java') && !n.includes('javascript')) return {
    icon: <FaJava size={iconSize} />,
    color: '#007396' // Dark Blue
  };
  
  // Frontend
  if (n.includes('react')) return {
    icon: <FaReact size={iconSize} />,
    color: '#61dafb' // Light Blue
  };
  if (n.includes('tailwind')) return {
    icon: <SiTailwindcss size={iconSize} />,
    color: '#38b2ac' // Teal
  };
  
  // Backend & Databases
  if (n.includes('springboot') || n.includes('spring boot') || n.includes('spring')) return {
    icon: <SiSpring size={iconSize} />,
    color: '#6db33f' // Green
  };
  if (n.includes('nodejs') || n.includes('node.js') || n.includes('node')) return {
    icon: <FaNodeJs size={iconSize} />,
    color: '#68a063' // Green
  };
  if (n.includes('mssql') || n.includes('sql server') || n.includes('t-sql')) return {
    icon: <FaCloud size={iconSize} />,
    color: '#cc2927' // Red
  };
  if (n.includes('postgresql') || n.includes('postgres') || n.includes('pgsql')) return {
    icon: <SiPostgresql size={iconSize} />,
    color: '#336791' // Blue
  };
  if (n.includes('mysql')) return {
    icon: <SiMysql size={iconSize} />,
    color: '#4479a1' // Blue
  };
  if (n.includes('mongodb') || n.includes('mongo')) return {
    icon: <SiMongodb size={iconSize} />,
    color: '#47a248' // Green
  };
  if (n.includes('database') || n.includes('sql') || n.includes('db')) return {
    icon: <FaDatabase size={iconSize} />,
    color: '#00c4cc' // Teal
  };
  
  // Cloud & DevOps
  if (n.includes('azure')) return {
    icon: <FaMicrosoft size={iconSize} />,
    color: '#0089d6' // Blue
  };
  if (n.includes('docker')) return {
    icon: <FaDocker size={iconSize} />,
    color: '#2496ed' // Blue
  };
  
  // Tools
  if (n.includes('git')) return {
    icon: <FaGitAlt size={iconSize} />,
    color: '#f34f29' // Orange
  };
  if (n.includes('power bi') || n.includes('powerbi')) return {
    icon: <Si365Datascience size={iconSize} />,
    color: '#f2c811' // Yellow
  };
  
  // Data Science & AI
  if (n.includes('machine learning') || n.includes('ml') || n.includes('ai') || n.includes('pytorch')) return {
    icon: <SiPytorch size={iconSize} />,
    color: '#ee4c2c' // Orange
  };
  if (n.includes('data cleaning') || n.includes('pandas')) return {
    icon: <SiPandas size={iconSize} />,
    color: '#150458' // Dark Blue
  };
  
  // Testing & Best Practices
  if (n.includes('tdd') || n.includes('unit testing') || n.includes('jest') || n.includes('testing')) return {
    icon: <SiJest size={iconSize} />,
    color: '#c21325' // Red
  };
  
  // Default fallback
  return {
    icon: <FaServer size={iconSize} />,
    color: '#4285f4' // Blue
  };
};

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const { icon, color } = getSkillInfo(skill.name);
  
  // Calculate a slightly darker shade for the progress bar
  const darkenColor = (col: string, amt: number) => {
    // Convert hex to RGB
    let r = parseInt(col.substring(1, 3), 16);
    let g = parseInt(col.substring(3, 5), 16);
    let b = parseInt(col.substring(5, 7), 16);
    
    // Darken
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - amt))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - amt))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - amt))));
    
    // Convert back to hex
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  const progressBarColor = darkenColor(color, 0.2);
  const progressBarGlow = `0 0 10px ${color}40`; // 25% opacity glow

  return (
    <div 
      className="p-4 bg-[#121212] border border-[#262626] rounded-lg hover:border-opacity-50 transition-all group"
      style={{ borderColor: `${color}20`, '--skill-color': color } as React.CSSProperties}
    >
      <div className="flex items-center gap-3 mb-3">
        <div style={{ color, minWidth: '24px', display: 'flex', justifyContent: 'center' }}>
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <span 
              className="font-bold text-sm truncate mr-2 transition-colors group-hover:text-white"
              title={skill.name}
              style={{ color }}
            >
              {skill.name}
            </span>
            <span 
              className="text-[10px] uppercase tracking-tighter whitespace-nowrap transition-colors"
              style={{ color: `${color}cc` }}
            >
              {skill.level}%
            </span>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${skill.level}%`,
            backgroundColor: progressBarColor,
            boxShadow: progressBarGlow
          }}
        />
      </div>
    </div>
  );
};

export default SkillBadge;
