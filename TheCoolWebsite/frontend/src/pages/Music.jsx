import React from 'react';
import { Link } from 'react-router-dom';

function MusicCard({ title, description, linkTo, emoji }) {
  return (
    <Link 
      to={linkTo} 
      className="relative h-64 rounded-xl p-8 flex flex-col justify-center items-center text-center text-white 
        bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg hover:shadow-2xl transition-all 
        duration-300 transform hover:scale-105 hover:z-10"
    >
      <span className="text-4xl mb-4" role="img" aria-label={title}>
        {emoji}
      </span>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-sm md:text-base opacity-90">{description}</p>
    </Link>
  );
}

function Music() {
  const musicCategories = [
    {
      title: "Music Theory",
      description: "Explore the building blocks of music and composition.",
      emoji: "🎼",
      link: "/music/theory"
    },
    {
      title: "Instruments",
      description: "Find out how musically literate you are!",
      emoji: "🎸",
      link: "/music/instruments"
    },
    {
      title: "Genres",
      description: "Discover various music genres and their characteristics.",
      emoji: "🎵",
      link: "/music/genres"
    },
    {
      title: "History",
      description: "Journey through the evolution of music across time.",
      emoji: "📜",
      link: "/music/history"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Music Exploration</h1>
          <p className="text-lg md:text-xl text-gray-300">Dive into the world of music and sound</p>
        </header>

        <section className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {musicCategories.map((category, index) => (
            <MusicCard
              key={index}
              title={category.title}
              description={category.description}
              emoji={category.emoji}
              linkTo={category.link}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default Music;
