import React, { useState, useEffect } from 'react';
import './AnimatedAnimeCard.css';

const AnimatedAnimeCard = ({ anime }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Animate rating stars
    if (isVisible) {
      const targetRating = parseFloat(anime.rating);
      let currentRating = 0;
      const interval = setInterval(() => {
        currentRating += 0.1;
        if (currentRating >= targetRating) {
          currentRating = targetRating;
          clearInterval(interval);
        }
        setRating(currentRating);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isVisible, anime.rating]);

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }

    const emptyStars = 10 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <div 
      className={`animated-anime-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-image-container">
        <img 
          src={anime.image} 
          alt={anime.title} 
          className="card-image"
        />
        <div className="image-overlay">
          <div className="overlay-content">
            <span className="watch-now">▶ Watch Now</span>
          </div>
        </div>
        <div className="rating-badge">
          {rating.toFixed(1)}/10
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{anime.title}</h3>
        
        <div className="genre-tags">
          {anime.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>

        <p className="card-description">{anime.description}</p>

        <div className="card-meta">
          <div className="stars-container">
            {renderStars()}
          </div>
          <div className="year-badge">{anime.year}</div>
        </div>

        <div className="card-actions">
          <button className="action-btn primary">Add to List</button>
          <button className="action-btn secondary">Learn More</button>
        </div>
      </div>

      <div className="card-glow"></div>
    </div>
  );
};

// Sample data for testing
const sampleAnime = {
  title: "Demon Slayer: Kimetsu no Yaiba",
  image: "images/demon_Slayer.jpg",
  rating: 8.7,
  year: 2019,
  genres: ["Action", "Supernatural", "Historical"],
  description: "Set in Taisho-era Japan, Tanjiro Kamado's peaceful life is shattered when demons kill his family and turn his sister, Nezuko, into a demon."
};

// Example usage component
const AnimatedAnimeCardDemo = () => {
  return (
    <div className="demo-container">
      <h2>Animated Anime Cards</h2>
      <div className="cards-grid">
        <AnimatedAnimeCard anime={sampleAnime} />
        <AnimatedAnimeCard anime={{
          ...sampleAnime,
          title: "Jujutsu Kaisen",
          image: "images/jjk.jpg",
          rating: 8.6,
          year: 2020,
          genres: ["Action", "Supernatural", "Drama"],
          description: "Yuji Itadori eats a cursed object to save his friends and becomes a host to a powerful curse named Sukuna."
        }} />
        <AnimatedAnimeCard anime={{
          ...sampleAnime,
          title: "Spy x Family",
          image: "images/spy.jpg",
          rating: 8.5,
          year: 2022,
          genres: ["Comedy", "Action", "Slice of Life"],
          description: "A master spy must 'build a fake family' to infiltrate an elite school. Unbeknownst to him, his 'wife' is an assassin."
        }} />
      </div>
    </div>
  );
};

export default AnimatedAnimeCard;
export { AnimatedAnimeCardDemo };
