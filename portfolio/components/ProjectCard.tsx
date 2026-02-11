
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-[#121212] border border-[#262626] rounded-md overflow-hidden hover:border-lime-400/50 transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1.5">
          {project.github && (
            <a 
              href={project.github} 
              target="_blank" 
              rel="noreferrer" 
              className="p-1 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
              title="View on GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          )}
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noreferrer" 
              className="p-1 bg-lime-400 rounded-full hover:bg-lime-500 text-black font-bold transition-colors flex items-center justify-center"
              title="View Live Demo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
        <p className="text-gray-400 text-[11px] mb-2 line-clamp-2 flex-1 leading-tight">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map(tech => (
            <span 
              key={tech} 
              className="text-[8px] uppercase tracking-wider font-bold bg-[#1a1a1a] text-gray-400 px-1 py-0.5 rounded border border-[#262626]"
              title={tech}
            >
              {tech.length > 8 ? `${tech.substring(0, 6)}..` : tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[8px] text-gray-500 self-center">+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
