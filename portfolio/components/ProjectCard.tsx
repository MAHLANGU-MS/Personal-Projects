
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-[#121212] border border-[#262626] rounded-xl overflow-hidden hover:border-lime-400/50 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
              GitHub
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="p-2 bg-lime-400 rounded-full hover:bg-lime-500 text-black font-bold">
              Demo
            </a>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <span key={tech} className="text-[10px] uppercase tracking-wider font-bold bg-[#1a1a1a] text-gray-400 px-2 py-1 rounded border border-[#262626]">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
