import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 text-center text-gray-400 text-sm">
      <div className="flex items-center justify-center space-x-2">
        <span>Built with</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm0 22c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm-1.5-17.5v16.5h3v-16.5h-3zm-3 3h-3v13.5h3v-13.5zm12 0h-3v13.5h3v-13.5z"/>
          </svg>
          <span>React</span>
          <span className="mx-1">&</span>
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.9,0.2,1.8,0.9,2.6,1.8c1.1,1.2,2.1,2.6,4.6,2.6 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.9-0.2-1.8-0.9-2.6-1.8C14.501,6.4,13.501,4.8,12.001,4.8z M6.001,12 c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.9,0.2,1.8,0.9,2.6,1.8c1.1,1.2,2.1,2.6,4.6,2.6c3.2,0,5.2-1.6,6-4.8 c-1.2,1.6-2.6,2.2-4.2,1.8c-0.9-0.2-1.8-0.9-2.6-1.8c-1.1-1.2-2.1-2.6-4.6-2.6z"/>
          </svg>
          <span>Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
