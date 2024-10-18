import React from "react";
import styled from "styled-components";

const Box = styled.div`
  max-width: 500px;
  margin-bottom: 1rem;
`;

const MovieCard = ({ movie, onAction, actionLabel }) => {
  const movieTitle = movie?.movie_results?.[0]?.title || "Unknown";
  const posterUrl = movie?.movie_results?.[0]?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.movie_results[0].poster_path}`
    : "No overview available";

  return (
    <Box>
      <h3>Movie Title: {movieTitle}</h3>
      <img
        src={posterUrl}
        alt={movieTitle}
        style={{ width: "100%", height: "auto" }}
      />
    </Box>
  );
};

export default MovieCard;
