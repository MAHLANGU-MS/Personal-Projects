
import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_PORTFOLIO, TERMINAL_GREETING } from './constants';
import Terminal from './components/Terminal';
import ProjectCard from './components/ProjectCard';
import SkillBadge from './components/SkillBadge';
import { FaGithub, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'experience'>('projects');
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const data = DEFAULT_PORTFOLIO;
  
  // Refs for each section
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  
  // Handle tab click and smooth scrolling
  const handleTabClick = (tab: 'projects' | 'skills' | 'experience') => {
    setActiveTab(tab);
    const refs = {
      projects: projectsRef,
      skills: skillsRef,
      experience: experienceRef
    };
    
    const element = refs[tab].current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${tab}`);
    }
  };
  
  // Handle initial hash URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (['projects', 'skills', 'experience'].includes(hash)) {
      handleTabClick(hash as 'projects' | 'skills' | 'experience');
    }
  }, []);
  
  // Handle scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = [
        { id: 'projects', ref: projectsRef },
        { id: 'skills', ref: skillsRef },
        { id: 'experience', ref: experienceRef }
      ];
      
      for (const { id, ref } of sections) {
        const element = ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(id as 'projects' | 'skills' | 'experience');
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const messages = [
    "Hi! I'm Siphamandla Mahlangu.",
    "Full Stack Developer | AI & Data Enthusiast.",
    "BSc Honours in IT @ University Of Johannesburg",
    "Based in Cape Town, South Africa."
  ].join('\n\n');
  const typingSpeed = 50; // ms per character

  // Group skills by the specific requested categories
  const groupedSkills = {
    'BACKEND': data.skills.filter(s => s.category === 'backend'),
    'AI & TOOLS': data.skills.filter(s => s.category === 'ai_tools'),
    'DATA': data.skills.filter(s => s.category === 'data'),
    'FRONTEND': data.skills.filter(s => s.category === 'frontend'),
    'TESTING': data.skills.filter(s => s.category === 'testing'),
    'LEARNING': data.skills.filter(s => s.category === 'learning')
  };

  // Auto-type effect for terminal
  useEffect(() => {
    let currentIndex = 0;
    const typeNextChar = () => {
      if (currentIndex < messages.length) {
        setTerminalText(prev => prev + messages.charAt(currentIndex));
        currentIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // Blinking cursor effect
        const interval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
      }
    };

    const timer = setTimeout(typeNextChar, 1000); // Start typing after 1 second
    return () => clearTimeout(timer);
  }, [messages, typingSpeed]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#d1d5db] flex flex-col selection:bg-[#00ff00] selection:text-black">
      {/* Header */}
      <header className="border-b border-[#111] bg-[#050505]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="w-10 h-10 bg-[#00ff00] rounded-sm flex items-center justify-center font-black text-black text-xl shadow-[0_0_15px_rgba(0,255,0,0.3)]">
            {data.profile.name.charAt(0)}
          </div>

          {/* Navigation */}
          {/* <div className="flex items-center gap-4">
            <button
              onClick={() => handleTabClick('projects')}
              className={`text-xs font-black tracking-[0.2em] uppercase transition-colors ${activeTab === 'projects' ? 'text-[#00ff00]' : 'text-gray-600 hover:text-white'}`}
            >
              PROJECTS
            </button>
            <button
              onClick={() => handleTabClick('skills')}
              className={`text-xs font-black tracking-[0.2em] uppercase transition-colors ${activeTab === 'skills' ? 'text-[#00ff00]' : 'text-gray-600 hover:text-white'}`}
            >
              SKILLS
            </button>
            <button
              onClick={() => handleTabClick('experience')}
              className={`text-xs font-black tracking-[0.2em] uppercase transition-colors ${activeTab === 'experience' ? 'text-[#00ff00]' : 'text-gray-600 hover:text-white'}`}
            >
              EXPERIENCE
            </button>
          </div> */}
          <nav className="sticky top-16 bg-[#050505]/95 backdrop-blur z-40 border-b border-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-8">
            {(['projects', 'skills', 'experience'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`py-4 px-2 text-xs font-black tracking-[0.2em] uppercase transition-all relative ${activeTab === tab ? 'text-[#00ff00]' : 'text-gray-600 hover:text-white'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href={`https://github.com/${data.profile.github}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href={data.profile.linkedin ? `https://linkedin.com/in/${data.profile.linkedin}` : '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0A66C2] transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </header>


      <main className="flex-1 w-full">
        {/* Terminal Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a] rounded-lg border border-[#222] p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="min-h-[120px] text-green-400">
              <span className="text-purple-400">$</span> {terminalText}
              <span className={`inline-block w-2 h-5 bg-green-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-12 max-w-4xl mx-auto space-y-8">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff00]/5 border border-[#00ff00]/20 text-[#00ff00] text-xs font-black tracking-widest uppercase">
            BSc Honours in IT @ University Of Johannesburg
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff00]/5 border border-[#00ff00]/20 text-[#00ff00] text-xs font-black tracking-widest uppercase">
            <FaMapMarkerAlt />
            <span>South Africa</span> 
          </div> */}
          <p className="text-xl leading-relaxed max-w-2xl">
            Engineering <span className="text-[#00ff00]">Robust - Efficient - Safe</span> Digital Solutions.
          </p>
        </section>

        {/* Content Sections */}
        <div className="min-h-[500px] w-full">
          {/* Projects Section */}
          <section 
            id="projects" 
            ref={projectsRef} 
            className="max-w-7xl w-full py-12 mx-auto px-4"
          >
            <h2 className="text-2xl font-black tracking-wide mb-8 flex items-center">
              <span className="text-[#00ff00] mr-2">#</span> Projects
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
              {data.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section 
            id="skills" 
            ref={skillsRef} 
            className="min-h-screen flex flex-col py-20 max-w-7xl mx-auto w-full px-4"
          >
            <h2 className="text-2xl font-black tracking-wide mb-12 flex items-center">
              <span className="text-[#00ff00] mr-2">#</span> Skills
            </h2>
            <div className="space-y-16 animate-in fade-in duration-500">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[#00ff00] font-black tracking-[0.4em] text-sm uppercase">{category}</h3>
                    <div className="flex-1 h-px bg-[#00ff00]/10" />
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {skills.map(s => <SkillBadge key={s.name} skill={s} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section 
            id="experience" 
            ref={experienceRef} 
            className="min-h-screen flex flex-col py-20 max-w-7xl mx-auto w-full px-4"
          >
            <h2 className="text-2xl font-black tracking-wide mb-12 flex items-center">
              <span className="text-[#00ff00] mr-2">#</span> Experience
            </h2>
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="group relative pl-12 border-l-2 border-[#111] pb-16 last:pb-0">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-[#050505] border-2 border-[#222] rounded-full group-hover:border-[#00ff00] transition-colors" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <h3 className="text-3xl font-black text-white tracking-tight">{exp.company}</h3>
                    <span className="text-xs font-mono text-[#00ff00] bg-[#00ff00]/5 px-4 py-2 rounded-sm border border-[#00ff00]/20">{exp.period}</span>
                  </div>
                  <div className="text-xl font-bold text-[#00ff00] mb-8">{exp.position}</div>
                  <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-gray-500 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#00ff00]/40 shrink-0 shadow-[0_0_5px_rgba(0,255,0,0.2)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#111] py-16 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-3 text-center md:text-left">
            <div className="font-black text-white text-2xl tracking-tighter">{data.profile.name.toUpperCase()}</div>
            <div className="text-[10px] text-gray-600 font-mono tracking-widest uppercase"> FULL STACK DEVELOPER // AI & DATA ENTHUSIAST // CAPE_TOWN</div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10">
            <a href={`https://${data.profile.github}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-500 hover:text-[#00ff00] transition-colors">GITHUB</a>
            <a href={`https://${data.profile.linkedin}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-500 hover:text-[#00ff00] transition-colors">LINKEDIN</a>
            <div className="hidden md:block h-6 w-px bg-[#111]" />
            <a href={`mailto:${data.profile.email}`} className="text-sm font-black text-[#00ff00] hover:brightness-125 transition-all border-b-2 border-[#00ff00]/20 pb-1">CONNECT_SYSTEM</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-[#111]/50 text-center">
           <span className="text-[10px] font-mono text-gray-700 tracking-[0.4em] uppercase">Built for high availability and strategic performance.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
