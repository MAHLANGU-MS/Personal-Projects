import React from 'react';
import { Link } from 'react-router-dom';

// panelClassName will be passed from the parent component (e.g., styles.panel from LandingPage.module.css)
// This allows us to reuse the panel styling defined in LandingPage.module.css for now.
// Later, we could move panel styles to its own CategoryCard.module.css if desired.
function CategoryCard({ title, description, linkTo, panelClassName, children }) {
  return (
    <Link to={linkTo} className={panelClassName}>
      <h3>{title}</h3>
      <p>{description}</p>
      {/* Allow for custom content inside the card if needed */}
      {children}
    </Link>
  );
}

export default CategoryCard; 