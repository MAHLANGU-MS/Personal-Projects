import React from 'react';
// Removed direct Link import as it's now handled by CategoryCard
import styles from './LandingPage.module.css';
import CategoryCard from '../components/CategoryCard'; // Import the new component

function LandingPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Header/Title Section */}
      <header className={styles.header}>
        <h1>Explore the Human Mind</h1>
        <p>Interactive journeys into thought and behavior</p>
      </header>

      {/* Simplified Categories Section */}
      <section className={styles.categoriesSection}>
        <CategoryCard 
          title="Psychology"
          description="Delve into classic thought experiments and cognitive biases."
          linkTo="/psychology"
          panelClassName={`${styles.panel} ${styles.psychologyPanel}`} // Combine base panel style with specific color
        />
        <CategoryCard 
          title="Sports"
          description="Uncover the mental game behind athletic performance."
          linkTo="/sports"
          panelClassName={`${styles.panel} ${styles.sportsPanel}`} 
        />
        <CategoryCard 
          title="Gambling"
          description="Understand the odds, risks, and psychology of chance."
          linkTo="/gambling"
          panelClassName={`${styles.panel} ${styles.gamblingPanel}`} 
        />
        <CategoryCard 
          title="Music"
          description="Understand the science of music."
          linkTo="/music"
          panelClassName={`${styles.panel} ${styles.musicPanel}`} 
        />
      </section>

      {/* Footer can be added later */}
    </div>
  );
}

export default LandingPage; 