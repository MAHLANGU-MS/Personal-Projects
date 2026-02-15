import React from 'react';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import CategoryCard from '../components/CategoryCard';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      {/* Social Icons */}
      <div className="w-full flex justify-between items-center mb-8">
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-2xl text-white hover:text-gray-300 transition-colors">
          <FaGithub />
        </a>
        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-2xl text-white hover:text-gray-300 transition-colors">
          <FaTwitter />
        </a>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header/Title Section */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Explore the Human Mind</h1>
          <p className="text-lg md:text-xl text-gray-300">Interactive journeys into thought and behavior</p>
        </header>

        {/* Categories Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          <CategoryCard 
            title="Psychology"
            description="Delve into classic thought experiments and cognitive biases."
            linkTo="/psychology"
            bgColor="from-purple-600 to-purple-800"
          />
          <CategoryCard 
            title="Sports"
            description="Uncover the mental game behind athletic performance."
            linkTo="/sports"
            bgColor="from-blue-600 to-blue-800"
          />
          <CategoryCard 
            title="Gambling"
            description="Understand the odds, risks, and psychology of chance."
            linkTo="/gambling"
            bgColor="from-emerald-600 to-emerald-800"
          />
          <CategoryCard 
            title="Music"
            description="Understand the science of music."
            linkTo="/music"
            bgColor="from-rose-600 to-rose-800"
          />
        </section>
      </div>
    </div>
  );
}

export default LandingPage;