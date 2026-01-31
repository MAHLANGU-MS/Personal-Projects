
import React from 'react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
}

const getIconClass = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('c#') || n.includes('net')) return 'devicon-csharp-plain';
  if (n.includes('springboot') || n.includes('spring boot')) return 'devicon-spring-original';
  if (n.includes('nodejs') || n.includes('node.js')) return 'devicon-nodejs-plain';
  if (n.includes('mssql') || (n.includes('sql') && n.includes('t-sql'))) return 'devicon-microsoftsqlserver-plain';
  if (n.includes('postgresql') || n.includes('pgsql')) return 'devicon-postgresql-plain';
  if (n.includes('mysql')) return 'devicon-mysql-plain';
  if (n.includes('mongodb')) return 'devicon-mongodb-plain';
  if (n.includes('react')) return 'devicon-react-original';
  if (n.includes('javascript') || n.includes('js')) return 'devicon-javascript-plain';
  if (n.includes('tailwind')) return 'devicon-tailwindcss-plain';
  if (n.includes('python') && !n.includes('machine')) return 'devicon-python-plain';
  if (n.includes('machine learning')) return 'devicon-pytorch-original';
  if (n.includes('java') && !n.includes('javascript')) return 'devicon-java-plain';
  if (n.includes('azure')) return 'devicon-azure-plain';
  if (n.includes('docker')) return 'devicon-docker-plain';
  if (n.includes('git')) return 'devicon-git-plain';
  if (n.includes('power bi')) return 'devicon-microsoft-plain';
  if (n.includes('data cleaning')) return 'devicon-pandas-plain';
  if (n.includes('oop') || n.includes('architecture') || n.includes('practices')) return 'devicon-canva-plain';
  if (n.includes('tdd') || n.includes('unit testing')) return 'devicon-jest-plain';
  return 'devicon-google-plain'; // Fallback
};

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const iconClass = getIconClass(skill.name);

  return (
    <div className="p-4 bg-[#121212] border border-[#262626] rounded-lg hover:border-lime-400/30 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        {iconClass && (
          <i className={`${iconClass} text-2xl text-lime-400/80 group-hover:text-lime-400 transition-colors`}></i>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-200 font-bold text-sm truncate mr-2" title={skill.name}>{skill.name}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter whitespace-nowrap">{skill.level}%</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-lime-400/80 group-hover:bg-lime-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(163,230,53,0.2)]"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBadge;
