import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CategoryCard({ title, description, linkTo, bgColor = 'from-blue-600 to-blue-800' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={linkTo} 
      className={`relative h-56 rounded-xl p-8 flex flex-col justify-center items-center text-center text-white 
        bg-gradient-to-br ${bgColor} shadow-lg transition-all duration-300 transform
        ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-sm md:text-base opacity-90">{description}</p>
      
      {/* Animated arrow icon that appears on hover */}
      <div 
        className={`absolute bottom-6 right-6 text-white transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14 5l7 7m0 0l-7 7m7-7H3" 
          />
        </svg>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white rounded-full opacity-20"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-2 border-white rounded-full opacity-20"></div>
    </Link>
  );
}

export default CategoryCard;