import React from "react";
import styled from "styled-components";

// Styled component for the movie card container
const Box = styled.div`
  max-width: 500px;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  // Responsive styles
  @media (max-width: 768px) {
    max-width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 80%;
  }

  @media (min-width: 1025px) {
    max-width: 500px;
  }
`;

// Styled component for the movie title
const Title = styled.h3`
  font-family: "Helvetica", sans-serif;
  text-align: left;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;

  // Responsive styles
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// Styled component for the image
const PosterImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;

  // Responsive styles
  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
  }

  @media (min-width: 1025px) {
    width: 100%;
  }
`;

const MovieCard = ({ movie, onAction, actionLabel }) => {
  const movieTitle = movie?.movie_results?.[0]?.title || "Unknown";
  const posterUrl = movie?.movie_results?.[0]?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.movie_results[0].poster_path}`
    : "No overview available";

  return (
    <Box role="article">
      <Title>{movieTitle}</Title>
      <PosterImage src={posterUrl} alt={movieTitle} />
    </Box>
  );
};

export default MovieCard;
