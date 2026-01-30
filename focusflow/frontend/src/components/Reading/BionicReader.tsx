import React from 'react';

interface BionicReaderProps {
  text: string;
  intensity: number; // 0-100
}

export const BionicReader: React.FC<BionicReaderProps> = ({ text, intensity }) => {
  const applyBionicFormat = (word: string): React.ReactNode => {
    const boldLength = Math.max(1, Math.floor(word.length * (intensity / 100)));
    return (
      <>
        <strong>{word.slice(0, boldLength)}</strong>
        {word.slice(boldLength)}
      </>
    );
  };

  return (
    <div className="bionic-text text-lg leading-relaxed">
      {text.split(' ').map((word, idx) => (
        <span key={idx} className="inline-block mr-1">
          {applyBionicFormat(word)}
        </span>
      ))}
    </div>
  );
};
